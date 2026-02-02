'use client'

import { useState } from 'react'
import InventoryGrid from './inventory-grid'

export default function InventoryCard({ 
  title, 
  productType, 
  groupedData, 
  measurements, 
  thicknesses,
  selectorLabel 
}) {
  const options = Object.keys(groupedData)
  const [selectedOption, setSelectedOption] = useState(options[0] || '')

  if (options.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-neutral-500 text-center py-8">
          No {productType.toLowerCase()} inventory yet.
        </p>
      </div>
    )
  }

  const selectedData = productType === 'Plywood' 
    ? groupedData[selectedOption]?.items || []
    : groupedData[selectedOption] || []

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-600">
            {selectorLabel}:
          </label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            {options.map(option => {
              const displayName = productType === 'Plywood' 
                ? groupedData[option]?.name 
                : option
              return (
                <option key={option} value={option}>
                  {displayName}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      <InventoryGrid
        items={selectedData}
        measurements={measurements}
        thicknesses={thicknesses}
        productType={productType}
      />
    </div>
  )
}
