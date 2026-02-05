'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get all challans
// Get all challans with pagination and search
export async function getChallans({ page = 1, limit = 10, query = '' } = {}) {
  const supabase = await createClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  let dbQuery = supabase
    .from('challans')
    .select(`
      *,
      challan_items(*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    dbQuery = dbQuery.or(`challan_number.ilike.%${query}%,customer_name.ilike.%${query}%`)
  }

  const { data, error, count } = await dbQuery

  if (error) {
    console.error('Error fetching challans:', error)
    return { data: [], totalPages: 0, totalCount: 0 }
  }

  return {
    data: data || [],
    totalPages: Math.ceil((count || 0) / limit),
    totalCount: count || 0
  }
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

    // Get tax, transport, and labour values
    const cgstPercentage = parseFloat(formData.get('cgst_percentage')) || 0
    const sgstPercentage = parseFloat(formData.get('sgst_percentage')) || 0
    const transportCharges = parseFloat(formData.get('transport_charges')) || 0
    const labourCharges = parseFloat(formData.get('labour_charges')) || 0

    // Calculate subtotal (items only)
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0)

    // Calculate tax amounts
    const cgstAmount = (subtotal * cgstPercentage) / 100
    const sgstAmount = (subtotal * sgstPercentage) / 100

    // Calculate total: subtotal + taxes + transport + labour
    const totalAmount = subtotal + cgstAmount + sgstAmount + transportCharges + labourCharges

    // Create challan
    const { data: challan, error: challanError } = await supabase
      .from('challans')
      .insert([{
        challan_number: challanNumber,
        customer_name: formData.get('customer_name'), // Keep for backward compatibility/display
        customer_id: formData.get('customer_id') || null,
        site_id: formData.get('site_id') || null,
        site_address: formData.get('site_address'),
        phone: formData.get('phone'),
        additional_phone: formData.get('additional_phone'),
        date: formData.get('date'),
        subtotal: subtotal,
        cgst_percentage: cgstPercentage,
        sgst_percentage: sgstPercentage,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        transport_charges: transportCharges,
        labour_charges: labourCharges,
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

// Delete challan (does NOT restore inventory) - Manager only
export async function deleteChallan(id) {
  const supabase = await createClient()
  
  // Check if user is manager
  const { getUserRole } = await import('./auth')
  const role = await getUserRole()
  
  if (role !== 'manager') {
    return { error: 'Unauthorized: Only managers can delete challans' }
  }

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

