'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get all customers
export async function getCustomers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }
  
  return data
}

// Get single customer
export async function getCustomer(id) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching customer:', error)
    return null
  }
  
  return data
}

// Create customer
export async function createCustomer(formData) {
  const supabase = await createClient()
  
  const customerData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email') || null,
  }
  
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

// Update customer
export async function updateCustomer(id, formData) {
  const supabase = await createClient()
  
  const customerData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email') || null,
  }
  
  const { error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

// Delete customer
export async function deleteCustomer(id) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/customers')
  return { success: true }
}
