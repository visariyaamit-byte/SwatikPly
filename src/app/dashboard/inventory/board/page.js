import { getInventory } from '@/app/actions/inventory'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BoardInventoryView from './board-inventory-view'
import { BOARD_MEASUREMENTS, BOARD_THICKNESS, BOARD_GRADES } from '@/lib/constants'

export default async function BoardInventoryPage() {
  const inventory = await getInventory()
  const boardInventory = inventory.filter(item => item.product_type === 'Board')

  // Group by grade
  const boardByGrade = boardInventory.reduce((acc, item) => {
    const grade = item.grade || 'Unknown'
    if (!acc[grade]) acc[grade] = []
    acc[grade].push(item)
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
        
        <h1 className="text-3xl font-bold tracking-tight text-brand">Board Inventory</h1>
        <p className="text-neutral-600 mt-1">Manage board stock by grade</p>
      </div>

      <BoardInventoryView
        groupedData={boardByGrade}
        measurements={BOARD_MEASUREMENTS}
        thicknesses={BOARD_THICKNESS}
        grades={BOARD_GRADES}
      />
    </div>
  )
}
