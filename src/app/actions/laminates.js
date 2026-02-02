'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'


// Get all laminate entries for a site
export async function getLaminatesBySite(siteId) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('laminate_entries')
    .select('*')
    .eq('site_id', siteId)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching laminates:', error)
    return []
  }
  
  return data
}

// Create laminate entry
export async function createLaminate(siteId, formData) {
  const supabase = await createClient()
  
  const laminateData = {
    site_id: siteId,
    room: formData.get('room'),
    model_name: formData.get('model_name'),
    description: formData.get('description'),
    notes: formData.get('notes') || null,
    date: formData.get('date'),
  }
  
  const { error } = await supabase
    .from('laminate_entries')
    .insert([laminateData])
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath(`/dashboard/sites/${siteId}`)
  return { success: true }
}

// Update laminate entry
export async function updateLaminate(id, siteId, formData) {
  const supabase = await createClient()
  
  const laminateData = {
    room: formData.get('room'),
    model_name: formData.get('model_name'),
    description: formData.get('description'),
    notes: formData.get('notes') || null,
    date: formData.get('date'),
  }
  
  const { error } = await supabase
    .from('laminate_entries')
    .update(laminateData)
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath(`/dashboard/sites/${siteId}`)
  return { success: true }
}

// Delete laminate entry
export async function deleteLaminate(id, siteId) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('laminate_entries')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath(`/dashboard/sites/${siteId}`)
  return { success: true }
}
