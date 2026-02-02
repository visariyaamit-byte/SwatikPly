import { getCompany, updateCompany } from '@/app/actions/companies'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditCompanyPage({ params }) {
  const { id } = await params
  const company = await getCompany(id)

  if (!company) {
    notFound()
  }

  async function handleUpdate(formData) {
    'use server'
    return updateCompany(id, formData)
  }

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

        <h1 className="text-3xl font-bold tracking-tight">Edit Company</h1>
        <p className="text-neutral-600 mt-1">Update company information</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-2xl">
        <form action={handleUpdate} className="space-y-6">
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
              defaultValue={company.name}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="e.g., Century Ply, Greenply, etc."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Update Company
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
