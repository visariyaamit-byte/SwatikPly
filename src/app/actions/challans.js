'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get all challans
export async function getChallans() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('challans')
    .select(`
      *,
      challan_items(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching challans:', error)
    return []
  }

  return data
}

// Get single challan
export async function getChallan(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('challans')
    .select(`
      *,
      challan_items(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching challan:', error)
    return null
  }

  return data
}

// Get next challan number
export async function getNextChallanNumber() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('challans')
    .select('challan_number')
    .order('challan_number', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error getting next challan number:', error)
    return '001'
  }

  if (!data || data.length === 0) {
    return '001'
  }

  // Parse current number and increment
  const currentNumber = parseInt(data[0].challan_number)
  const nextNumber = currentNumber + 1
  
  // Pad with zeros (001, 002, etc.)
  return nextNumber.toString().padStart(3, '0')
}

// Create challan
export async function createChallan(formData) {
  const supabase = await createClient()

  try {
    // Get next challan number
    const challanNumber = await getNextChallanNumber()

    // Parse items from form data
    const itemsJson = formData.get('items')
    const items = JSON.parse(itemsJson)

    // Get tax and transport values
    const cgstPercentage = parseFloat(formData.get('cgst_percentage')) || 0
    const sgstPercentage = parseFloat(formData.get('sgst_percentage')) || 0
    const transportCharges = parseFloat(formData.get('transport_charges')) || 0

    // Calculate subtotal (items only)
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0)

    // Calculate tax amounts
    const cgstAmount = (subtotal * cgstPercentage) / 100
    const sgstAmount = (subtotal * sgstPercentage) / 100

    // Calculate total: subtotal + taxes + transport
    const totalAmount = subtotal + cgstAmount + sgstAmount + transportCharges

    // Create challan
    const { data: challan, error: challanError } = await supabase
      .from('challans')
      .insert([{
        challan_number: challanNumber,
        customer_name: formData.get('customer_name'),
        date: formData.get('date'),
        subtotal: subtotal,
        cgst_percentage: cgstPercentage,
        sgst_percentage: sgstPercentage,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        transport_charges: transportCharges,
        total_amount: totalAmount,
        notes: formData.get('notes') || null
      }])
      .select()
      .single()

    if (challanError) {
      return { error: challanError.message }
    }

    // Create challan items and deduct inventory
    for (const item of items) {
      // Insert challan item
      const { error: itemError } = await supabase
        .from('challan_items')
        .insert([{
          challan_id: challan.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          inventory_id: item.inventory_id || null
        }])

      if (itemError) {
        return { error: itemError.message }
      }

      // Deduct from inventory if inventory_id exists
      if (item.inventory_id) {
        const { data: inventoryItem, error: fetchError } = await supabase
          .from('inventory')
          .select('quantity')
          .eq('id', item.inventory_id)
          .single()

        if (fetchError) {
          return { error: 'Failed to fetch inventory: ' + fetchError.message }
        }

        const newQuantity = inventoryItem.quantity - item.quantity

        if (newQuantity < 0) {
          return { error: `Insufficient stock for ${item.description}` }
        }

        const { error: updateError } = await supabase
          .from('inventory')
          .update({ quantity: newQuantity })
          .eq('id', item.inventory_id)

        if (updateError) {
          return { error: 'Failed to update inventory: ' + updateError.message }
        }
      }
    }

    revalidatePath('/dashboard/challans')
    return { success: true, challanId: challan.id }
  } catch (error) {
    return { error: error.message }
  }
}

// Delete challan (does NOT restore inventory)
export async function deleteChallan(id) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('challans')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/challans')
  return { success: true }
}
