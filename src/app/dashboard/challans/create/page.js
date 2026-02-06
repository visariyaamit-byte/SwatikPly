import { getNextChallanNumber } from '@/app/actions/challans'
import { getInventory } from '@/app/actions/inventory'
import { getCustomers } from '@/app/actions/customers'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreateChallanForm from './create-challan-form'

export default async function CreateChallanPage() {
  const [nextChallanNumber, inventory, customers] = await Promise.all([
    getNextChallanNumber(),
    getInventory(),
    getCustomers()
  ])

  // Filter only items with stock > 0
  const availableInventory = inventory.filter(item => item.quantity > 0)

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/challans"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Challans
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-brand">Create Delivery Challan</h1>
        <p className="text-neutral-600 mt-1">Add items from inventory or custom entries</p>
      </div>

      <CreateChallanForm 
        nextChallanNumber={nextChallanNumber}
        inventory={availableInventory}
        customers={customers}
      />
    </div>
  )
}
