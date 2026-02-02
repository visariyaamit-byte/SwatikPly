'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get all companies
export async function getCompanies() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name')
  
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
  
  const companyData = {
    name: formData.get('name'),
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
  const { generateInventoryForCompany } = await import('./inventory-generator')
  await generateInventoryForCompany(data.id)
  
  revalidatePath('/dashboard/inventory')
  redirect('/dashboard/inventory')
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
  
  revalidatePath('/dashboard/inventory')
  redirect('/dashboard/inventory')
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
