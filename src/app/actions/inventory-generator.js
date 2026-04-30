'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  PLYWOOD_MEASUREMENTS,
  PLYWOOD_THICKNESS,
  BOARD_MEASUREMENTS,
  BOARD_THICKNESS,
  MDF_COLORS,
  MDF_THICKNESS,
  FLEXI_TYPES,
  FLEXI_THICKNESS
} from '@/lib/constants'

// Generate all plywood inventory combinations for a company
export async function generateInventoryForCompany(companyId) {
  const supabase = await createClient()

  const combinations = []

  for (const measurement of PLYWOOD_MEASUREMENTS) {
    for (const thickness of PLYWOOD_THICKNESS) {
      combinations.push({
        product_type: 'Plywood',
        company_id: companyId,
        grade: null,
        measurement,
        thickness,
        quantity: 0,
        notes: null
      })
    }
  }

  console.log(`Generating ${combinations.length} plywood combinations for company ${companyId}`)

  const { data, error } = await supabase
    .from('inventory')
    .insert(combinations)
    .select()

  if (error) {
    console.error('Error generating inventory for company:', error)
    return { error: error.message }
  }

  console.log(`Successfully created ${data?.length || 0} inventory items`)
  revalidatePath('/dashboard/inventory')
  return { success: true, count: data?.length || 0 }
}

// Generate all board inventory combinations for a company
export async function generateInventoryForBoardCompany(companyId) {
  const supabase = await createClient()

  const combinations = []

  for (const measurement of BOARD_MEASUREMENTS) {
    for (const thickness of BOARD_THICKNESS) {
      combinations.push({
        product_type: 'Board',
        company_id: companyId,
        grade: null,
        measurement,
        thickness,
        quantity: 0,
        notes: null
      })
    }
  }

  console.log(`Generating ${combinations.length} board combinations for company ${companyId}`)

  const { data, error } = await supabase
    .from('inventory')
    .insert(combinations)
    .select()

  if (error) {
    console.error('Error generating board inventory for company:', error)
    return { error: error.message }
  }

  console.log(`Successfully created ${data?.length || 0} board inventory items`)
  revalidatePath('/dashboard/inventory')
  return { success: true, count: data?.length || 0 }
}

// Generate all MDF/Flexi combinations (one-time setup)
export async function generateAllNonPlywoodInventory() {
  const supabase = await createClient()

  const combinations = []

  // MDF combinations (no measurement)
  for (const color of MDF_COLORS) {
    for (const thickness of MDF_THICKNESS) {
      combinations.push({
        product_type: 'MDF',
        company_id: null,
        grade: color,
        measurement: null,
        thickness,
        quantity: 0,
        notes: null
      })
    }
  }

  // Flexi combinations (no measurement)
  for (const type of FLEXI_TYPES) {
    for (const thickness of FLEXI_THICKNESS) {
      combinations.push({
        product_type: 'Flexi',
        company_id: null,
        grade: type,
        measurement: null,
        thickness,
        quantity: 0,
        notes: null
      })
    }
  }

  console.log(`Generating ${combinations.length} non-plywood combinations (MDF: ${MDF_COLORS.length * MDF_THICKNESS.length}, Flexi: ${FLEXI_TYPES.length * FLEXI_THICKNESS.length})`)

  const { data, error } = await supabase
    .from('inventory')
    .insert(combinations)
    .select()

  if (error) {
    console.error('Error generating non-plywood inventory:', error)
    return { error: error.message }
  }

  console.log(`Successfully created ${data?.length || 0} inventory items`)
  revalidatePath('/dashboard/inventory')
  return { success: true, count: data?.length || 0 }
}

// Initialize inventory system (call once)
export async function initializeInventory() {
  const supabase = await createClient()

  console.log('Starting inventory initialization...')

  // Get all companies
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('id, name, product_type')

  if (companiesError) {
    console.error('Error fetching companies:', companiesError)
    return { error: 'Failed to fetch companies: ' + companiesError.message }
  }

  console.log(`Found ${companies?.length || 0} companies`)

  let totalCreated = 0

  // Generate inventory for each company
  if (companies && companies.length > 0) {
    for (const company of companies) {
      console.log(`Generating inventory for company: ${company.name} (${company.product_type})`)
      let result
      if (company.product_type === 'Board') {
        result = await generateInventoryForBoardCompany(company.id)
      } else {
        result = await generateInventoryForCompany(company.id)
      }
      if (result.error) {
        return { error: `Failed for company ${company.name}: ${result.error}` }
      }
      totalCreated += result.count || 0
    }
  }

  // Generate MDF and Flexi inventory
  console.log('Generating MDF and Flexi inventory...')
  const nonPlywoodResult = await generateAllNonPlywoodInventory()
  if (nonPlywoodResult.error) {
    return { error: 'Failed to generate MDF/Flexi: ' + nonPlywoodResult.error }
  }
  totalCreated += nonPlywoodResult.count || 0

  console.log(`Inventory initialization complete! Created ${totalCreated} items total`)
  return { success: true, totalCreated }
}
