'use client'

import { createInventoryItem } from '@/app/actions/inventory'
import { 
  PLYWOOD_MEASUREMENTS, 
  PLYWOOD_THICKNESS,
  BOARD_MEASUREMENTS,
  BOARD_THICKNESS,
  BOARD_GRADES,
  MDF_COLORS,
  MDF_THICKNESS,
  FLEXI_TYPES,
  FLEXI_THICKNESS,
  PRODUCT_TYPES
} from '@/lib/constants'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddInventoryForm({ companies }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productType, setProductType] = useState('Plywood')
  const router = useRouter()

  // Dynamic options based on product type
  const getMeasurements = () => {
    if (productType === 'Plywood') return PLYWOOD_MEASUREMENTS
    if (productType === 'Board') return BOARD_MEASUREMENTS
    return [] // MDF and Flexi don't use measurements
  }

  const getThickness = () => {
    if (productType === 'Plywood') return PLYWOOD_THICKNESS
    if (productType === 'Board') return BOARD_THICKNESS
    if (productType === 'MDF') return MDF_THICKNESS
    if (productType === 'Flexi') return FLEXI_THICKNESS
    return []
  }

  const getGradeOptions = () => {
    if (productType === 'Board') return BOARD_GRADES
    if (productType === 'MDF') return MDF_COLORS
    if (productType === 'Flexi') return FLEXI_TYPES
    return []
  }

  const getGradeLabel = () => {
    if (productType === 'Board') return 'Grade'
    if (productType === 'MDF') return 'Color'
    if (productType === 'Flexi') return 'Type'
    return 'Grade'
  }

  const measurements = getMeasurements()
  const thicknesses = getThickness()
  const gradeOptions = getGradeOptions()
  const gradeLabel = getGradeLabel()
  const showMeasurement = productType === 'Plywood' || productType === 'Board'

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const result = await createInventoryItem(formData)

    if (result.error) {
      alert('Error adding inventory: ' + result.error)
      setIsSubmitting(false)
    } else {
      e.target.reset()
      setIsSubmitting(false)
      setProductType('Plywood')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Type */}
        <div>
          <label htmlFor="product_type" className="block text-sm font-medium mb-2">
            Product Type <span className="text-red-500">*</span>
          </label>
          <select
            id="product_type"
            name="product_type"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          >
            {PRODUCT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Company (for Plywood) or Grade/Color/Type (for others) */}
        {productType === 'Plywood' ? (
          <div>
            <label htmlFor="company_id" className="block text-sm font-medium mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            <select
              id="company_id"
              name="company_id"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label htmlFor="grade" className="block text-sm font-medium mb-2">
              {gradeLabel} <span className="text-red-500">*</span>
            </label>
            <select
              id="grade"
              name="grade"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select {gradeLabel.toLowerCase()}</option>
              {gradeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        {/* Measurement (only for Plywood and Board) */}
        {showMeasurement && (
          <div>
            <label htmlFor="measurement" className="block text-sm font-medium mb-2">
              Measurement <span className="text-red-500">*</span>
            </label>
            <select
              id="measurement"
              name="measurement"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select measurement</option>
              {measurements.map((measurement) => (
                <option key={measurement} value={measurement}>{measurement}</option>
              ))}
            </select>
          </div>
        )}

        {/* Thickness */}
        <div>
          <label htmlFor="thickness" className="block text-sm font-medium mb-2">
            Thickness <span className="text-red-500">*</span>
          </label>
          <select
            id="thickness"
            name="thickness"
            required
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select thickness</option>
            {thicknesses.map((thickness) => (
              <option key={thickness} value={thickness}>{thickness}</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-2">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            required
            min="0"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="0"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-2">
          Notes <span className="text-neutral-400">(Optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
          placeholder="Additional notes"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Adding...' : 'Add to Inventory'}
      </button>
    </form>
  )
}


