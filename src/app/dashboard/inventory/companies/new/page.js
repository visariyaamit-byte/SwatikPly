import { createCompany } from '@/app/actions/companies'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewCompanyPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/inventory/companies"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Companies
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-brand">Add New Company</h1>
        <p className="text-neutral-600 mt-1">Add a plywood manufacturer/brand</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-2xl">
        <form action={createCompany} className="space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              placeholder="e.g., Century Ply, Greenply, etc."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-brand text-white py-3 rounded-xl font-medium hover:bg-brand-dark transition-colors"
            >
              Add Company
            </button>
            <Link
              href="/dashboard/inventory/companies"
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
