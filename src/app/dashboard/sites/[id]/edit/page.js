import { getSite, updateSite } from '@/app/actions/sites'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditSitePage({ params }) {
  const { id } = await params
  const site = await getSite(id)

  if (!site) {
    notFound()
  }

  async function handleUpdate(formData) {
    'use server'
    return updateSite(id, formData)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/sites/${id}`}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Site Details
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Site</h1>
        <p className="text-neutral-600 mt-1">Update site information</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-2xl">
        <form action={handleUpdate} className="space-y-6">
          {/* Customer (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Customer
            </label>
            <div className="px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-700">
              {site.customer.name} • {site.customer.phone}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Customer cannot be changed</p>
          </div>

          {/* Site Name */}
          <div>
            <label htmlFor="flat_number" className="block text-sm font-medium mb-2">
              Site Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="flat_number"
              name="flat_number"
              required
              defaultValue={site.flat_number}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="e.g., A-101, Flat 5B, Villa 3"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Site Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              defaultValue={site.address}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
              placeholder="Enter complete address"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Update Site
            </button>
            <Link
              href={`/dashboard/sites/${id}`}
              className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
