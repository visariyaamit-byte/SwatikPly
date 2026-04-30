'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get all companies, optionally filtered by product type
export async function getCompanies(productType = null) {
  const supabase = await createClient()

  let query = supabase
    .from('companies')
    .select('*')
    .order('name')

  if (productType) {
    query = query.eq('product_type', productType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return data
}

// Get single company
export async function getCompany(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching company:', error)
    return null
  }

  return data
}

// Create company
export async function createCompany(formData) {
  const supabase = await createClient()

  const productType = formData.get('product_type') || 'Plywood'

  const companyData = {
    name: formData.get('name'),
    product_type: productType,
  }

  const { data, error } = await supabase
    .from('companies')
    .insert([companyData])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Auto-generate all inventory combinations for this company
  if (productType === 'Plywood') {
    const { generateInventoryForCompany } = await import('./inventory-generator')
    await generateInventoryForCompany(data.id)
  } else if (productType === 'Board') {
    const { generateInventoryForBoardCompany } = await import('./inventory-generator')
    await generateInventoryForBoardCompany(data.id)
  }

  revalidatePath('/dashboard/inventory')

  if (productType === 'Board') {
    redirect('/dashboard/inventory/board-companies')
  }
  redirect('/dashboard/inventory/companies')
}

// Update company
export async function updateCompany(id, formData) {
  const supabase = await createClient()

  const companyData = {
    name: formData.get('name'),
  }

  const { error } = await supabase
    .from('companies')
    .update(companyData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Get the company to know its product_type for redirect
  const { data: company } = await supabase
    .from('companies')
    .select('product_type')
    .eq('id', id)
    .single()

  revalidatePath('/dashboard/inventory')

  if (company?.product_type === 'Board') {
    redirect('/dashboard/inventory/board-companies')
  }
  redirect('/dashboard/inventory/companies')
}

// Delete company
export async function deleteCompany(id) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}
