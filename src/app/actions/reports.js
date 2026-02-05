'use server'

import { createClient } from '@/lib/supabase/server'

// Get all unique product types
export async function getProductTypes() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('inventory')
    .select('product_type')
    .order('product_type')
  
  if (error) {
    return { data: [], error: error.message }
  }
  
  const uniqueTypes = [...new Set(data.map(item => item.product_type))]
  return { data: uniqueTypes, error: null }
}

// Get companies (for Plywood)
export async function getCompanies() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('companies')
    .select('id, name')
    .order('name')
  
  if (error) {
    return { data: [], error: error.message }
  }
  
  return { data, error: null }
}

// Get all grades (for Board, MDF, Flexi products)
export async function getBoardGrades() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('inventory')
    .select('grade, product_type')
    .in('product_type', ['Board', 'MDF', 'Flexi'])
    .not('grade', 'is', null)
  
  if (error) {
    return { data: [], error: error.message }
  }
  
  const uniqueGrades = [...new Set(data.map(item => item.grade))]
  return { data: uniqueGrades, error: null }
}

// Get grades for a specific product type
export async function getGradesByType(productType) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('inventory')
    .select('grade')
    .eq('product_type', productType)
    .not('grade', 'is', null)
  
  if (error) {
    return { data: [], error: error.message }
  }
  
  const uniqueGrades = [...new Set(data.map(item => item.grade))]
  return { data: uniqueGrades, error: null }
}

// Get products by company (for Plywood)
export async function getProductsByCompany(companyId) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('inventory')
    .select('id, measurement, thickness')
    .eq('product_type', 'Plywood')
    .eq('company_id', companyId)
    .order('measurement')
  
  if (error) {
    return { data: [], error: error.message }
  }
  
  return { data, error: null }
}

// Get products by grade (for Board, MDF, Flexi)
export async function getProductsByGrade(grade) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('inventory')
    .select('id, measurement, thickness, product_type')
    .eq('grade', grade)
    .order('measurement')
  
  if (error) {
    return { data: [], error: error.message }
  }
  
  return { data, error: null }
}

// Get sales for a specific product
export async function getProductSales(inventoryId, startDate = null, endDate = null) {
  const supabase = await createClient()
  
  if (!inventoryId) {
    return { data: null, totalQuantity: 0, totalRevenue: 0, error: null }
  }
  
  // If date filters are provided, first get challan IDs in date range
  let challanIds = null
  if (startDate || endDate) {
    let challanQuery = supabase
      .from('challans')
      .select('id')
    
    if (startDate) {
      challanQuery = challanQuery.gte('date', startDate)
    }
    if (endDate) {
      challanQuery = challanQuery.lte('date', endDate)
    }
    
    const { data: challans } = await challanQuery
    challanIds = challans?.map(c => c.id) || []
    
    if (challanIds.length === 0) {
      return { data: [], totalQuantity: 0, totalRevenue: 0, error: null }
    }
  }
  
  let query = supabase
    .from('challan_items')
    .select(`
      id,
      description,
      quantity,
      rate,
      amount,
      challan:challan_id (
        challan_number,
        date,
        customer_name
      )
    `)
    .eq('inventory_id', inventoryId)
    .order('challan(date)', { ascending: false })
  
  // Filter by challan IDs if date range was specified
  if (challanIds) {
    query = query.in('challan_id', challanIds)
  }
  
  const { data, error } = await query
  
  if (error) {
    return { data: null, totalQuantity: 0, totalRevenue: 0, error: error.message }
  }
  
  // Calculate totals
  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0)
  
  return { data, totalQuantity, totalRevenue, error: null }
}

// Get aggregated sales by product type
export async function getSalesByType(productType, startDate = null, endDate = null) {
  const supabase = await createClient()
  
  // Get all inventory IDs for this type
  const { data: inventoryItems } = await supabase
    .from('inventory')
    .select('id')
    .eq('product_type', productType)
  
  if (!inventoryItems || inventoryItems.length === 0) {
    return { data: [], totalQuantity: 0, totalRevenue: 0, error: null }
  }
  
  const inventoryIds = inventoryItems.map(item => item.id)
  
  // If date filters are provided, first get challan IDs in date range
  let challanIds = null
  if (startDate || endDate) {
    let challanQuery = supabase
      .from('challans')
      .select('id')
    
    if (startDate) {
      challanQuery = challanQuery.gte('date', startDate)
    }
    if (endDate) {
      challanQuery = challanQuery.lte('date', endDate)
    }
    
    const { data: challans } = await challanQuery
    challanIds = challans?.map(c => c.id) || []
    
    // If no challans in date range, return empty
    if (challanIds.length === 0) {
      return { data: [], totalQuantity: 0, totalRevenue: 0, error: null }
    }
  }
  
  // Get all sales for these inventory items
  let query = supabase
    .from('challan_items')
    .select(`
      id,
      description,
      quantity,
      rate,
      amount,
      challan:challan_id (
        challan_number,
        date,
        customer_name
      )
    `)
    .in('inventory_id', inventoryIds)
    .order('challan(date)', { ascending: false })
  
  // Filter by challan IDs if date range was specified
  if (challanIds) {
    query = query.in('challan_id', challanIds)
  }
  
  const { data, error } = await query
  
  if (error) {
    return { data: [], totalQuantity: 0, totalRevenue: 0, error: error.message }
  }
  
  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0)
  
  return { data, totalQuantity, totalRevenue, error: null }
}

// Get aggregated sales by company
export async function getSalesByCompany(companyId, startDate = null, endDate = null) {
  const supabase = await createClient()
  
  // Get all inventory IDs for this company
  const { data: inventoryItems } = await supabase
    .from('inventory')
    .select('id')
    .eq('company_id', companyId)
  
  if (!inventoryItems || inventoryItems.length === 0) {
    return { data: [], totalQuantity: 0, totalRevenue: 0, error: null }
  }
  
  const inventoryIds = inventoryItems.map(item => item.id)
  
  // If date filters are provided, first get challan IDs in date range
  let challanIds = null
  if (startDate || endDate) {
    let challanQuery = supabase
      .from('challans')
      .select('id')
    
    if (startDate) {
      challanQuery = challanQuery.gte('date', startDate)
    }
    if (endDate) {
      challanQuery = challanQuery.lte('date', endDate)
    }
    
    const { data: challans } = await challanQuery
    challanIds = challans?.map(c => c.id) || []
    
    if (challanIds.length === 0) {
      return { data: [], totalQuantity: 0, totalRevenue: 0, error: null }
    }
  }
  
  // Get all sales for these inventory items
  let query = supabase
    .from('challan_items')
    .select(`
      id,
      description,
      quantity,
      rate,
      amount,
      challan:challan_id (
        challan_number,
        date,
        customer_name
      )
    `)
    .in('inventory_id', inventoryIds)
    .order('challan(date)', { ascending: false })
  
  if (challanIds) {
    query = query.in('challan_id', challanIds)
  }
  
  const { data, error } = await query
  
  if (error) {
    return { data: [], totalQuantity: 0, totalRevenue: 0, error: error.message }
  }
  
  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0)
  
  return { data, totalQuantity, totalRevenue, error: null }
}

// Get aggregated sales by grade (for Board, MDF, Flexi)
export async function getSalesByBoardGrade(grade, startDate = null, endDate = null) {
  const supabase = await createClient()
  
  // Get all inventory IDs for this grade
  const { data: inventoryItems } = await supabase
    .from('inventory')
    .select('id')
    .eq('grade', grade)
  
  if (!inventoryItems || inventoryItems.length === 0) {
    return { data: [], totalQuantity: 0, totalRevenue: 0, error: null }
  }
  
  const inventoryIds = inventoryItems.map(item => item.id)
  
  // If date filters are provided, first get challan IDs in date range
  let challanIds = null
  if (startDate || endDate) {
    let challanQuery = supabase
      .from('challans')
      .select('id')
    
    if (startDate) {
      challanQuery = challanQuery.gte('date', startDate)
    }
    if (endDate) {
      challanQuery = challanQuery.lte('date', endDate)
    }
    
    const { data: challans } = await challanQuery
    challanIds = challans?.map(c => c.id) || []
    
    if (challanIds.length === 0) {
      return { data: [], totalQuantity: 0, totalRevenue: 0, error: null }
    }
  }
  
  // Get all sales for these inventory items
  let query = supabase
    .from('challan_items')
    .select(`
      id,
      description,
      quantity,
      rate,
      amount,
      challan:challan_id (
        challan_number,
        date,
        customer_name
      )
    `)
    .in('inventory_id', inventoryIds)
    .order('challan(date)', { ascending: false })
  
  if (challanIds) {
    query = query.in('challan_id', challanIds)
  }
  
  const { data, error } = await query
  
  if (error) {
    return { data: [], totalQuantity: 0, totalRevenue: 0, error: error.message }
  }
  
  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0)
  
  return { data, totalQuantity, totalRevenue, error: null }
}

