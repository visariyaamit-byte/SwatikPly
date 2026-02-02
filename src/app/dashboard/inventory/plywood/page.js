import { getInventory } from '@/app/actions/inventory'
import { getCompanies } from '@/app/actions/companies'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'
import PlywoodInventoryView from './plywood-inventory-view'
import { PLYWOOD_MEASUREMENTS, PLYWOOD_THICKNESS } from '@/lib/constants'

export default async function PlywoodInventoryPage() {
  const [inventory, companies] = await Promise.all([
    getInventory(),
    getCompanies()
  ])

  const plywoodInventory = inventory.filter(item => item.product_type === 'Plywood')

  // Group by company
  const plywoodByCompany = plywoodInventory.reduce((acc, item) => {
    const companyId = item.company_id
    const companyName = item.company?.name || 'Unknown'
    if (!acc[companyId]) {
      acc[companyId] = {
        id: companyId,
        name: companyName,
        items: []
      }
    }
    acc[companyId].items.push(item)
    return acc
  }, {})

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Inventory
        </Link>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Plywood Inventory</h1>
            <p className="text-neutral-600 mt-1">Manage plywood stock by company</p>
          </div>

          <Link
            href="/dashboard/inventory/companies"
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors w-full md:w-auto justify-center"
          >
            <Package size={20} />
            Manage Companies
          </Link>
        </div>
      </div>

      <PlywoodInventoryView
        groupedData={plywoodByCompany}
        measurements={PLYWOOD_MEASUREMENTS}
        thicknesses={PLYWOOD_THICKNESS}
      />
    </div>
  )
}
