import { createSite } from '@/app/actions/sites'
import { getCustomer } from '@/app/actions/customers'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function NewSitePage({ searchParams }) {
  const params = await searchParams
  const customerId = params.customer

  if (!customerId) {
    redirect('/dashboard/sites')
  }

  const customer = await getCustomer(customerId)

  if (!customer) {
    redirect('/dashboard/sites')
  }

  async function handleCreate(formData) {
    'use server'
    return createSite(customerId, formData)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/sites"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Sites
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-brand">Add New Site</h1>
        <p className="text-neutral-600 mt-1">
          Create a new site for <span className="font-semibold">{customer.name}</span>
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-2xl">
        <form action={handleCreate} className="space-y-6">
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
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
              placeholder="Enter complete address"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-brand text-white py-3 rounded-xl font-medium hover:bg-brand-dark transition-colors"
            >
              Create Site
            </button>
            <Link
              href="/dashboard/sites"
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
