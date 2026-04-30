'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Search customers by name, phone, or email
export async function searchCustomers(query) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
    .order('name')
    .limit(10)
  
  if (error) {
    console.error('Error searching customers:', error)
    return []
  }
  
  return data
}

// Get all sites for a customer with laminate count
export async function getSitesByCustomer(customerId, sortOrder = 'desc') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select(`
      *,
      customer:customers(name, phone),
      laminate_entries(count)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: sortOrder === 'asc' })
  
  if (error) {
    console.error('Error fetching sites:', error)
    return []
  }
  
  return data
}

// Get single site with all details
export async function getSite(id) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select(`
      *,
      customer:customers(id, name, phone, email),
      laminate_entries(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching site:', error)
    return null
  }
  
  return data
}

// Create new site
export async function createSite(customerId, formData) {
  const supabase = await createClient()
  
  const siteData = {
    customer_id: customerId,
    address: formData.get('address'),
    flat_number: formData.get('flat_number'),
  }
  
  const { data, error } = await supabase
    .from('sites')
    .insert([siteData])
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/sites')
  redirect(`/dashboard/sites/${data.id}`)
}

// Update site
export async function updateSite(id, formData) {
  const supabase = await createClient()
  
  const siteData = {
    address: formData.get('address'),
    flat_number: formData.get('flat_number'),
  }
  
  const { error } = await supabase
    .from('sites')
    .update(siteData)
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/sites')
  redirect(`/dashboard/sites/${id}`)
}

// Delete site
export async function deleteSite(id) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/sites')
  return { success: true }
}
