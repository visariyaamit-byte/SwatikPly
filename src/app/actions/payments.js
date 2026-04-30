'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getUserRole } from './auth'

// Helper function to verify manager role
async function verifyManagerRole() {
  const role = await getUserRole()
  if (role !== 'manager') {
    throw new Error('Unauthorized: Manager access required')
  }
}

// Record a payment for a customer
export async function recordPayment(customerId, amount, paymentDate, paymentMethod, notes = null) {
  await verifyManagerRole()
  
  const supabase = await createClient()

  // Validate amount
  if (!amount || amount <= 0) {
    return { error: 'Invalid payment amount' }
  }

  // Get customer balance to validate payment doesn't exceed pending
  const balance = await getCustomerBalance(customerId)
  if (balance.error) {
    return { error: balance.error }
  }

  if (amount > balance.total_pending) {
    return { error: `Payment amount (₹${amount}) exceeds pending amount (₹${balance.total_pending})` }
  }

  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        customer_id: customerId,
        amount: parseFloat(amount),
        payment_date: paymentDate,
        payment_method: paymentMethod,
        notes: notes
      }])
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/customers')
    revalidatePath(`/dashboard/customers/${customerId}/payments`)
    return { success: true, data }
  } catch (error) {
    return { error: error.message }
  }
}

// Get payments for a customer with optional filters
export async function getPaymentsByCustomer(customerId, filters = {}) {
  await verifyManagerRole()
  
  const supabase = await createClient()

  let query = supabase
    .from('payments')
    .select('*')
    .eq('customer_id', customerId)
    .order('payment_date', { ascending: false })

  // Apply date filters
  const filterType = filters.filter || 'all'
  
  if (filterType !== 'all') {
    const today = new Date()
    let startDate, endDate

    switch (filterType) {
      case 'last7days':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        query = query.gte('payment_date', startDate.toISOString().split('T')[0])
        break
      
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), 0)
        query = query
          .gte('payment_date', startDate.toISOString().split('T')[0])
          .lte('payment_date', endDate.toISOString().split('T')[0])
        break
      
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        query = query.gte('payment_date', startDate.toISOString().split('T')[0])
        break
      
      case 'year':
        if (filters.year) {
          startDate = new Date(filters.year, 0, 1)
          endDate = new Date(filters.year, 11, 31)
          query = query
            .gte('payment_date', startDate.toISOString().split('T')[0])
            .lte('payment_date', endDate.toISOString().split('T')[0])
        }
        break
      
      case 'custom':
        if (filters.startDate) {
          query = query.gte('payment_date', filters.startDate)
        }
        if (filters.endDate) {
          query = query.lte('payment_date', filters.endDate)
        }
        break
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching payments:', error)
    return { error: error.message, data: [] }
  }

  return { data: data || [] }
}

// Delete a payment
export async function deletePayment(paymentId) {
  await verifyManagerRole()
  
  const supabase = await createClient()

  // Get payment details to revalidate the correct customer page
  const { data: payment } = await supabase
    .from('payments')
    .select('customer_id')
    .eq('id', paymentId)
    .single()

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId)

  if (error) {
    return { error: error.message }
  }

  if (payment) {
    revalidatePath('/dashboard/customers')
    revalidatePath(`/dashboard/customers/${payment.customer_id}/payments`)
  }

  return { success: true }
}

// Get customer balance (total billed, total paid, total pending)
export async function getCustomerBalance(customerId) {
  await verifyManagerRole()
  
  const supabase = await createClient()

  // Get total billed (sum of all challans)
  const { data: challans, error: challansError } = await supabase
    .from('challans')
    .select('total_amount')
    .eq('customer_id', customerId)

  if (challansError) {
    return { error: challansError.message }
  }

  const totalBilled = challans?.reduce((sum, challan) => sum + (parseFloat(challan.total_amount) || 0), 0) || 0

  // Get total paid (sum of all payments)
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('amount')
    .eq('customer_id', customerId)

  if (paymentsError) {
    return { error: paymentsError.message }
  }

  const totalPaid = payments?.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0) || 0

  return {
    total_billed: totalBilled,
    total_paid: totalPaid,
    total_pending: totalBilled - totalPaid
  }
}

// Get available years for year filter
export async function getPaymentYears(customerId) {
  await verifyManagerRole()
  
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('payment_date')
    .eq('customer_id', customerId)
    .order('payment_date', { ascending: false })

  if (error) {
    return { data: [] }
  }

  // Extract unique years
  const years = [...new Set(data.map(p => new Date(p.payment_date).getFullYear()))]
  return { data: years.sort((a, b) => b - a) }
}
