'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUserRole } from './auth'

// Get all customers
export async function getCustomers() {
  const supabase = await createClient()
  const role = await getUserRole()
  
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }
  
  // If not manager, return customers without payment data
  if (role !== 'manager') {
    return customers
  }
  
  // For managers, add payment calculations
  const customersWithPayments = await Promise.all(
    customers.map(async (customer) => {
      // Get total billed (sum of all challans)
      const { data: challans } = await supabase
        .from('challans')
        .select('total_amount')
        .eq('customer_id', customer.id)
      
      const totalBilled = challans?.reduce((sum, challan) => 
        sum + (parseFloat(challan.total_amount) || 0), 0) || 0
      
      // Get total paid (sum of all payments)
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('customer_id', customer.id)
      
      const totalPaid = payments?.reduce((sum, payment) => 
        sum + (parseFloat(payment.amount) || 0), 0) || 0
      
      return {
        ...customer,
        total_billed: totalBilled,
        total_paid: totalPaid,
        total_pending: totalBilled - totalPaid
      }
    })
  )
  
  return customersWithPayments
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

// Delete customer - Manager only
export async function deleteCustomer(id) {
  const supabase = await createClient()
  
  // Check if user is manager
  const role = await getUserRole()
  
  if (role !== 'manager') {
    return { error: 'Unauthorized: Only managers can delete customers' }
  }
  
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

// Get customer with payment details (manager only)
export async function getCustomerWithPaymentDetails(customerId, filters = {}) {
  const role = await getUserRole()
  
  if (role !== 'manager') {
    return { error: 'Unauthorized: Manager access required' }
  }
  
  const supabase = await createClient()
  
  // Get customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()
  
  if (customerError) {
    return { error: customerError.message }
  }
  
  // Build date filter for challans and payments
  let challanQuery = supabase
    .from('challans')
    .select('*')
    .eq('customer_id', customerId)
    .order('date', { ascending: false })
  
  let paymentQuery = supabase
    .from('payments')
    .select('amount')
    .eq('customer_id', customerId)
  
  // Apply date filters
  const filterType = filters.filter || 'all'
  
  if (filterType !== 'all') {
    const today = new Date()
    let startDate, endDate

    switch (filterType) {
      case 'last7days':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        challanQuery = challanQuery.gte('date', startDate.toISOString().split('T')[0])
        paymentQuery = paymentQuery.gte('payment_date', startDate.toISOString().split('T')[0])
        break
      
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), 0)
        challanQuery = challanQuery
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])
        paymentQuery = paymentQuery
          .gte('payment_date', startDate.toISOString().split('T')[0])
          .lte('payment_date', endDate.toISOString().split('T')[0])
        break
      
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        challanQuery = challanQuery.gte('date', startDate.toISOString().split('T')[0])
        paymentQuery = paymentQuery.gte('payment_date', startDate.toISOString().split('T')[0])
        break
      
      case 'year':
        if (filters.year) {
          startDate = new Date(filters.year, 0, 1)
          endDate = new Date(filters.year, 11, 31)
          challanQuery = challanQuery
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', endDate.toISOString().split('T')[0])
          paymentQuery = paymentQuery
            .gte('payment_date', startDate.toISOString().split('T')[0])
            .lte('payment_date', endDate.toISOString().split('T')[0])
        }
        break
      
      case 'custom':
        if (filters.startDate) {
          challanQuery = challanQuery.gte('date', filters.startDate)
          paymentQuery = paymentQuery.gte('payment_date', filters.startDate)
        }
        if (filters.endDate) {
          challanQuery = challanQuery.lte('date', filters.endDate)
          paymentQuery = paymentQuery.lte('payment_date', filters.endDate)
        }
        break
    }
  }
  
  // Get filtered challans
  const { data: challans, error: challansError } = await challanQuery
  
  if (challansError) {
    return { error: challansError.message }
  }
  
  // Calculate total billed from filtered challans
  const totalBilled = challans?.reduce((sum, challan) => 
    sum + (parseFloat(challan.total_amount) || 0), 0) || 0
  
  // Get filtered payments
  const { data: payments } = await paymentQuery
  
  const totalPaid = payments?.reduce((sum, payment) => 
    sum + (parseFloat(payment.amount) || 0), 0) || 0
  
  return {
    customer,
    challans: challans || [],
    total_billed: totalBilled,
    total_paid: totalPaid,
    total_pending: totalBilled - totalPaid
  }
}
