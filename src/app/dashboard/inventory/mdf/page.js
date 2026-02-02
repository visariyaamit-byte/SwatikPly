import { getInventory } from '@/app/actions/inventory'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import MdfInventoryView from './mdf-inventory-view'
import { MDF_THICKNESS, MDF_COLORS } from '@/lib/constants'

export default async function MdfInventoryPage() {
  const inventory = await getInventory()
  const mdfInventory = inventory.filter(item => item.product_type === 'MDF')

  // Group by color
  const mdfByColor = mdfInventory.reduce((acc, item) => {
    const color = item.grade || 'Unknown'
    if (!acc[color]) acc[color] = []
    acc[color].push(item)
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
        
        <h1 className="text-3xl font-bold tracking-tight">MDF Inventory</h1>
        <p className="text-neutral-600 mt-1">Manage MDF stock by color</p>
      </div>

      <MdfInventoryView
        groupedData={mdfByColor}
        thicknesses={MDF_THICKNESS}
        colors={MDF_COLORS}
      />
    </div>
  )
}
