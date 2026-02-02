'use client'

import { useState } from 'react'
import InventoryGrid from '../inventory-grid'

export default function BoardInventoryView({ groupedData, measurements, thicknesses, grades }) {
  const [selectedGrade, setSelectedGrade] = useState(grades[0] || '')

  if (Object.keys(groupedData).length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
        <p className="text-neutral-600 text-lg">
          No board inventory yet.
        </p>
      </div>
    )
  }

  const selectedItems = groupedData[selectedGrade] || []

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-8">
      <div className="mb-8">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Select Grade
        </label>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="w-full md:w-auto min-w-[300px] px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
        >
          {grades.map(grade => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      <InventoryGrid
        items={selectedItems}
        measurements={measurements}
        thicknesses={thicknesses}
        productType="Board"
      />
    </div>
  )
}
