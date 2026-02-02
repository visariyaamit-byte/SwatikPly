'use client'

import { useState, useEffect } from 'react'
import { updateInventoryItem } from '@/app/actions/inventory'
import { useRouter } from 'next/navigation'

export default function InventoryGrid({ 
  items, 
  measurements, 
  thicknesses,
  productType 
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [quantities, setQuantities] = useState({})
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Initialize quantities from items
  useEffect(() => {
    const initialQuantities = {}
    items.forEach(item => {
      const key = productType === 'MDF' || productType === 'Flexi' 
        ? item.thickness 
        : `${item.measurement}-${item.thickness}`
      initialQuantities[key] = {
        id: item.id,
        quantity: item.quantity
      }
    })
    setQuantities(initialQuantities)
  }, [items, productType])

  const handleQuantityChange = (key, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        quantity: parseInt(newQuantity) || 0
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Update all changed items
    for (const [key, data] of Object.entries(quantities)) {
      const originalItem = items.find(item => item.id === data.id)
      if (originalItem && originalItem.quantity !== data.quantity) {
        const formData = new FormData()
        formData.append('product_type', originalItem.product_type)
        formData.append('thickness', originalItem.thickness)
        formData.append('quantity', data.quantity.toString())
        formData.append('notes', originalItem.notes || '')
        
        if (originalItem.company_id) {
          formData.append('company_id', originalItem.company_id)
        }
        if (originalItem.grade) {
          formData.append('grade', originalItem.grade)
        }
        if (originalItem.measurement) {
          formData.append('measurement', originalItem.measurement)
        }
        
        await updateInventoryItem(data.id, formData)
      }
    }
    
    setIsSaving(false)
    setIsEditing(false)
    setHasChanges(false)
    router.refresh()
  }

  const handleCancel = () => {
    // Reset to original quantities
    const initialQuantities = {}
    items.forEach(item => {
      const key = productType === 'MDF' || productType === 'Flexi' 
        ? item.thickness 
        : `${item.measurement}-${item.thickness}`
      initialQuantities[key] = {
        id: item.id,
        quantity: item.quantity
      }
    })
    setQuantities(initialQuantities)
    setIsEditing(false)
    setHasChanges(false)
  }

  // For MDF and Flexi (no measurements, just thickness)
  if (productType === 'MDF' || productType === 'Flexi') {
    return (
      <div>
        <div className="flex justify-end gap-2 mb-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {thicknesses.map(thickness => {
            const data = quantities[thickness]
            return (
              <div key={thickness} className="border border-neutral-200 rounded-lg p-3">
                <div className="text-sm font-medium text-neutral-600 mb-2">{thickness}</div>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={data?.quantity || 0}
                    onChange={(e) => handleQuantityChange(thickness, e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                ) : (
                  <div className="text-2xl font-bold">{data?.quantity || 0}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // For Plywood and Board (measurements × thickness grid)
  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-neutral-100 p-4 text-left font-semibold border-b border-neutral-200 whitespace-nowrap sticky left-0 z-10">
                Size
              </th>
              {thicknesses.map(thickness => (
                <th key={thickness} className="bg-neutral-100 p-4 text-center font-semibold border-b border-neutral-200 whitespace-nowrap">
                  {thickness}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement, idx) => (
              <tr key={measurement} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                <td className="p-4 font-medium border-b border-neutral-200">
                  {measurement}
                </td>
                {thicknesses.map(thickness => {
                  const key = `${measurement}-${thickness}`
                  const data = quantities[key]
                  return (
                    <td key={thickness} className="p-4 text-center border-b border-neutral-200">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={data?.quantity || 0}
                          onChange={(e) => handleQuantityChange(key, e.target.value)}
                          className="w-20 px-3 py-2 border border-neutral-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      ) : (
                        <span className={`font-semibold text-lg ${data?.quantity > 0 ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {data?.quantity || 0}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
