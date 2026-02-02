'use client'

import { updateLaminate } from '@/app/actions/laminates'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function EditLaminateModal({ laminate, siteId, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const result = await updateLaminate(laminate.id, siteId, formData)

    if (result.error) {
      alert('Error updating laminate: ' + result.error)
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
          <h3 className="text-xl font-bold">Edit Laminate Entry</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room */}
            <div>
              <label htmlFor="room" className="block text-sm font-medium mb-2">
                Room <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="room"
                name="room"
                defaultValue={laminate.room}
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Living Room"
              />
            </div>

            {/* Model Name */}
            <div>
              <label htmlFor="model_name" className="block text-sm font-medium mb-2">
                Laminate Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="model_name"
                name="model_name"
                required
                defaultValue={laminate.model_name}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Premium Oak"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                defaultValue={laminate.date}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={2}
              defaultValue={laminate.description}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Describe the laminate details"
            />
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
              defaultValue={laminate.notes || ''}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Additional notes"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Entry'}
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
