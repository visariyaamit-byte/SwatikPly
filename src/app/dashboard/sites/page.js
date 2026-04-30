'use client'

import { useState } from 'react'
import CustomerSearch from './customer-search'
import SitesList from './sites-list'
import Link from 'next/link'
import { Plus, User } from 'lucide-react'

export default function SitesPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-brand">Site Details</h1>
        <p className="text-neutral-600 mt-1">Search customer and manage their sites</p>
      </div>

      {/* Customer Search */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6">
        <label className="block text-sm font-medium mb-3">
          Search Customer
        </label>
        <CustomerSearch onSelectCustomer={setSelectedCustomer} />
      </div>

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={24} />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold text-neutral-900 truncate">{selectedCustomer.name}</h2>
                <p className="text-neutral-600">{selectedCustomer.phone}</p>
                {selectedCustomer.email && (
                  <p className="text-neutral-500 text-sm truncate">{selectedCustomer.email}</p>
                )}
              </div>
            </div>

            <Link
              href={`/dashboard/sites/new?customer=${selectedCustomer.id}`}
              className="flex items-center justify-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors w-full sm:w-auto"
            >
              <Plus size={20} />
              Add Site
            </Link>
          </div>
        </div>
      )}

      {/* Sites List */}
      {selectedCustomer ? (
        <SitesList customerId={selectedCustomer.id} />
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <p className="text-neutral-600">Search and select a customer to view their sites</p>
        </div>
      )}
    </div>
  )
}
