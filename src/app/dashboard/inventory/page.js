import Link from 'next/link'
import { Package, Layers, Box, FileText } from 'lucide-react'
import { getInventory } from '@/app/actions/inventory'
import { getCompanies } from '@/app/actions/companies'
import InitializeInventoryButton from './initialize-inventory-button'

export default async function InventoryPage() {
  const [inventory, companies] = await Promise.all([
    getInventory(),
    getCompanies()
  ])

  const hasNoInventory = inventory.length === 0

  // Count items per product type
  const plywoodCount = inventory.filter(i => i.product_type === 'Plywood').reduce((sum, i) => sum + i.quantity, 0)
  const boardCount = inventory.filter(i => i.product_type === 'Board').reduce((sum, i) => sum + i.quantity, 0)
  const mdfCount = inventory.filter(i => i.product_type === 'MDF').reduce((sum, i) => sum + i.quantity, 0)
  const flexiCount = inventory.filter(i => i.product_type === 'Flexi').reduce((sum, i) => sum + i.quantity, 0)

  const inventoryCards = [
    {
      title: 'Plywood Inventory',
      description: 'Manage plywood stock by company',
      icon: Layers,
      href: '/dashboard/inventory/plywood',
      count: plywoodCount,
      color: 'bg-brand/10 text-brand border-brand/20'
    },
    {
      title: 'Board Inventory',
      description: 'Manage board stock by grade',
      icon: Package,
      href: '/dashboard/inventory/board',
      count: boardCount,
      color: 'bg-brand/10 text-brand border-brand/20'
    },
    {
      title: 'MDF Inventory',
      description: 'Manage MDF stock by color',
      icon: Box,
      href: '/dashboard/inventory/mdf',
      count: mdfCount,
      color: 'bg-brand/10 text-brand border-brand/20'
    },
    {
      title: 'Flexi Inventory',
      description: 'Manage flexi stock by type',
      icon: FileText,
      href: '/dashboard/inventory/flexi',
      count: flexiCount,
      color: 'bg-brand/10 text-brand border-brand/20'
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">Inventory Management</h1>
            <p className="text-neutral-600 mt-1">Manage plywood, board, MDF, and flexi stock</p>
          </div>

          {hasNoInventory && <InitializeInventoryButton />}
        </div>
      </div>

      {hasNoInventory ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <p className="text-neutral-600 text-lg">
            No inventory yet. Click "Initialize Inventory" to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventoryCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:border-brand hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-neutral-900">
                  {card.title}
                </h3>
                
                <p className="text-neutral-600 text-sm mb-4">
                  {card.description}
                </p>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{card.count}</span>
                  <span className="text-neutral-500 text-sm">total units</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
