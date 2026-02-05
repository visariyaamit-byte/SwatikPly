'use client'

import { updateInventoryItem } from '@/app/actions/inventory'
import { getCompanies } from '@/app/actions/companies'
import { 
  PLYWOOD_MEASUREMENTS, 
  PLYWOOD_THICKNESS,
  BOARD_MEASUREMENTS,
  BOARD_THICKNESS,
  BOARD_GRADES,
  MDF_COLORS,
  MDF_THICKNESS,
  FLEXI_TYPES,
  FLEXI_THICKNESS
} from '@/lib/constants'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditInventoryModal({ item, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState([])
  const router = useRouter()

  const getMeasurements = () => {
    if (item.product_type === 'Plywood') return PLYWOOD_MEASUREMENTS
    if (item.product_type === 'Board') return BOARD_MEASUREMENTS
    return []
  }

  const getThickness = () => {
    if (item.product_type === 'Plywood') return PLYWOOD_THICKNESS
    if (item.product_type === 'Board') return BOARD_THICKNESS
    if (item.product_type === 'MDF') return MDF_THICKNESS
    if (item.product_type === 'Flexi') return FLEXI_THICKNESS
    return []
  }

  const getGradeOptions = () => {
    if (item.product_type === 'Board') return BOARD_GRADES
    if (item.product_type === 'MDF') return MDF_COLORS
    if (item.product_type === 'Flexi') return FLEXI_TYPES
    return []
  }

  const getGradeLabel = () => {
    if (item.product_type === 'Board') return 'Grade'
    if (item.product_type === 'MDF') return 'Color'
    if (item.product_type === 'Flexi') return 'Type'
    return 'Grade'
  }

  const measurements = getMeasurements()
  const thicknesses = getThickness()
  const gradeOptions = getGradeOptions()
  const gradeLabel = getGradeLabel()
  const showMeasurement = item.product_type === 'Plywood' || item.product_type === 'Board'

  useEffect(() => {
    async function loadCompanies() {
      const data = await getCompanies()
      setCompanies(data)
    }
    if (item.product_type === 'Plywood') {
      loadCompanies()
    }
  }, [item.product_type])

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const result = await updateInventoryItem(item.id, formData)

    if (result.error) {
      alert('Error updating inventory: ' + result.error)
      setIsSubmitting(false)
    } else {
      router.refresh()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-brand">Edit Inventory Item</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden product type field */}
          <input type="hidden" name="product_type" value={item.product_type} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Type (Read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Type
              </label>
              <div className="px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-700">
                {item.product_type}
              </div>
            </div>

            {/* Company (for Plywood) or Grade/Color/Type (for others) */}
            {item.product_type === 'Plywood' ? (
              <div>
                <label htmlFor="company_id" className="block text-sm font-medium mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  id="company_id"
                  name="company_id"
                  required
                  defaultValue={item.company_id}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
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
                  defaultValue={item.grade}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
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
                  defaultValue={item.measurement}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
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
                defaultValue={item.thickness}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
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
                defaultValue={item.quantity}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              defaultValue={item.notes || ''}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand text-white py-3 rounded-xl font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


