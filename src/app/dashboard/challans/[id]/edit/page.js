import { getChallan } from '@/app/actions/challans'
import { getInventory } from '@/app/actions/inventory'
import { getCustomers } from '@/app/actions/customers'
import { getSitesByCustomer } from '@/app/actions/sites'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditChallanForm from './edit-challan-form'
import { notFound } from 'next/navigation'

export default async function EditChallanPage({ params }) {
  const { id } = await params
  const [challan, inventory, customers] = await Promise.all([
    getChallan(id),
    getInventory(),
    getCustomers()
  ])

  if (!challan) {
    notFound()
  }

  // Fetch sites for the challan's customer
  let sites = []
  if (challan.customer_id) {
    sites = await getSitesByCustomer(challan.customer_id)
  }

  // For inventory dropdown, show items with stock > 0 PLUS items already in this challan
  // (since their stock was already deducted, we need to account for that)
  const challanInventoryIds = challan.challan_items
    .filter(item => item.inventory_id)
    .map(item => item.inventory_id)

  const availableInventory = inventory.filter(item =>
    item.quantity > 0 || challanInventoryIds.includes(item.id)
  )

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/challans/${id}`}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Challan
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-brand">
          Edit Challan #{challan.challan_number}
        </h1>
        <p className="text-neutral-600 mt-1">Modify challan details and items</p>
      </div>

      <EditChallanForm
        challan={challan}
        inventory={availableInventory}
        customers={customers}
        initialSites={sites}
      />
    </div>
  )
}
