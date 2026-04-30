import { getInventory } from '@/app/actions/inventory'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import FlexiInventoryView from './flexi-inventory-view'
import { FLEXI_THICKNESS, FLEXI_TYPES } from '@/lib/constants'

export default async function FlexiInventoryPage() {
  const inventory = await getInventory()
  const flexiInventory = inventory.filter(item => item.product_type === 'Flexi')

  // Group by type
  const flexiByType = flexiInventory.reduce((acc, item) => {
    const type = item.grade || 'Unknown'
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Inventory
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-brand">Flexi Inventory</h1>
        <p className="text-neutral-600 mt-1">Manage flexi stock by type</p>
      </div>

      <FlexiInventoryView
        groupedData={flexiByType}
        thicknesses={FLEXI_THICKNESS}
        types={FLEXI_TYPES}
      />
    </div>
  )
}
