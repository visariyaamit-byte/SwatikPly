'use client'

import { useState } from 'react'
import InventoryGrid from '../inventory-grid'

export default function MdfInventoryView({ groupedData, thicknesses, colors }) {
  const [selectedColor, setSelectedColor] = useState(colors[0] || '')

  if (Object.keys(groupedData).length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
        <p className="text-neutral-600 text-lg">
          No MDF inventory yet.
        </p>
      </div>
    )
  }

  const selectedItems = groupedData[selectedColor] || []

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-8">
      <div className="mb-8">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Select Color
        </label>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full md:w-auto min-w-[300px] px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
        >
          {colors.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      <InventoryGrid
        items={selectedItems}
        measurements={null}
        thicknesses={thicknesses}
        productType="MDF"
      />
    </div>
  )
}
