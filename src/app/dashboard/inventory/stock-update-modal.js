'use client'

import { updateStock } from '@/app/actions/inventory'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StockUpdateModal({ item, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [type, setType] = useState('addition')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const quantity = parseInt(formData.get('quantity'))
    const reason = formData.get('reason')
    
    const change = type === 'addition' ? quantity : -quantity
    const result = await updateStock(item.id, change, type, reason)

    if (result.error) {
      alert('Error updating stock: ' + result.error)
      setIsSubmitting(false)
    } else {
      router.refresh()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-brand">Update Stock</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-neutral-50 rounded-xl">
          <p className="text-sm text-neutral-600">Current Stock</p>
          <p className="text-2xl font-bold text-neutral-900">{item.quantity}</p>
          <p className="text-sm text-neutral-600 mt-1">
            {item.measurement} {item.thickness}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Action <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('addition')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'addition'
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Add Stock
              </button>
              <button
                type="button"
                onClick={() => setType('removal')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'removal'
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Remove Stock
              </button>
            </div>
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
              min="1"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Enter quantity"
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              required
              rows={2}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand resize-none"
              placeholder="e.g., New delivery, Sold to customer, Damaged goods"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${
                type === 'addition'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSubmitting ? 'Updating...' : `${type === 'addition' ? 'Add' : 'Remove'} Stock`}
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
