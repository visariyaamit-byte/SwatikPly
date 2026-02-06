'use client'

import { useState } from 'react'
import InventoryGrid from '../inventory-grid'

export default function PlywoodInventoryView({ groupedData, measurements, thicknesses }) {
  const companies = Object.values(groupedData)
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '')

  if (companies.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
        <p className="text-neutral-600 text-lg">
          No plywood inventory yet. Add companies to get started.
        </p>
      </div>
    )
  }

  const selectedCompany = groupedData[selectedCompanyId]

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-8">
      {/* Company Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Select Company
        </label>
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full md:w-auto min-w-[300px] px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
        >
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Grid */}
      {selectedCompany && (
        <InventoryGrid
          items={selectedCompany.items}
          measurements={measurements}
          thicknesses={thicknesses}
          productType="Plywood"
        />
      )}
    </div>
  )
}
