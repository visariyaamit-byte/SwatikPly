'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get all inventory items
export async function getInventory() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      company:companies(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inventory:', error)
    return []
  }

  return data
}

// Get inventory by company
export async function getInventoryByCompany(companyId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('company_id', companyId)
    .order('measurement')

  if (error) {
    console.error('Error fetching inventory:', error)
    return []
  }

  return data
}

// Get single inventory item
export async function getInventoryItem(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      company:companies(name)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching inventory item:', error)
    return null
  }

  return data
}

// Create or update inventory item (upsert to prevent duplicates)
export async function createInventoryItem(formData) {
  const supabase = await createClient()
  
  const productType = formData.get('product_type')
  const quantity = parseInt(formData.get('quantity'))
  
  const inventoryData = {
    product_type: productType,
    company_id: productType === 'Plywood' ? formData.get('company_id') : null,
    grade: productType !== 'Plywood' ? formData.get('grade') : null,
    measurement: (productType === 'Plywood' || productType === 'Board') ? formData.get('measurement') : null,
    thickness: formData.get('thickness'),
    quantity: quantity,
    notes: formData.get('notes') || null,
  }

  // Check if item already exists
  let query = supabase
    .from('inventory')
    .select('id, quantity')
    .eq('product_type', productType)
    .eq('thickness', inventoryData.thickness)

  if (productType === 'Plywood') {
    query = query.eq('company_id', inventoryData.company_id)
    if (inventoryData.measurement) {
      query = query.eq('measurement', inventoryData.measurement)
    }
  } else {
    query = query.eq('grade', inventoryData.grade)
    if (inventoryData.measurement) {
      query = query.eq('measurement', inventoryData.measurement)
    } else {
      query = query.is('measurement', null)
    }
  }

  const { data: existing } = await query.maybeSingle()

  if (existing) {
    // Update existing item - add to quantity
    const newQuantity = existing.quantity + quantity
    const { error } = await supabase
      .from('inventory')
      .update({ quantity: newQuantity })
      .eq('id', existing.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Create new item
    const { error } = await supabase
      .from('inventory')
      .insert([inventoryData])

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}

// Update inventory item
export async function updateInventoryItem(id, formData) {
  const supabase = await createClient()
  
  const productType = formData.get('product_type')
  
  const inventoryData = {
    product_type: productType,
    company_id: productType === 'Plywood' ? formData.get('company_id') : null,
    grade: productType !== 'Plywood' ? formData.get('grade') : null,
    measurement: (productType === 'Plywood' || productType === 'Board') ? formData.get('measurement') : null,
    thickness: formData.get('thickness'),
    quantity: parseInt(formData.get('quantity')),
    notes: formData.get('notes') || null,
  }
  
  const { error } = await supabase
    .from('inventory')
    .update(inventoryData)
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/inventory')
  return { success: true }
}

// Delete inventory item
export async function deleteInventoryItem(id) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/inventory')
  return { success: true }
}

// Quick stock update (add or remove quantity)
export async function updateStock(id, quantityChange) {
  const supabase = await createClient()

  // Get current quantity
  const { data: item, error: fetchError } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('id', id)
    .single()

  if (fetchError) {
    return { error: fetchError.message }
  }

  const newQuantity = item.quantity + quantityChange

  if (newQuantity < 0) {
    return { error: 'Insufficient stock' }
  }

  // Update quantity
  const { error: updateError } = await supabase
    .from('inventory')
    .update({ quantity: newQuantity })
    .eq('id', id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true, newQuantity }
}
