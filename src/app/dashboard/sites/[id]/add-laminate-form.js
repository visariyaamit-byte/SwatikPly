'use client'

import { createLaminate } from '@/app/actions/laminates'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

export default function AddLaminateForm({ siteId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const result = await createLaminate(siteId, formData)

    if (result.error) {
      alert('Error adding laminate: ' + result.error)
      setIsSubmitting(false)
    } else {
      e.target.reset()
      e.target.reset()
      setIsSubmitting(false)
      setIsOpen(false)
      router.refresh()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
      >
        <Plus size={20} />
        Add Laminate Entry
      </button>
    )
  }

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
      <h3 className="font-semibold mb-4">Add New Laminate Entry</h3>
      
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
              required
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Living Room, Bedroom 1"
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
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
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
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
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
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
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
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
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
            {isSubmitting ? 'Adding...' : 'Add Entry'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
