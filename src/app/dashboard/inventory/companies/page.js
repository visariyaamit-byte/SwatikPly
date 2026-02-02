import { getCompanies } from '@/app/actions/companies'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import CompanyCard from './company-card'

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Inventory
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Companies</h1>
            <p className="text-neutral-600 mt-1">Add and manage plywood manufacturers/brands</p>
          </div>

          <Link
            href="/dashboard/inventory/companies/new"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={20} />
            Add Company
          </Link>
        </div>
      </div>

      {/* Companies List */}
      {companies.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <p className="text-neutral-600 mb-4">No companies found. Add your first company.</p>
          <Link
            href="/dashboard/inventory/companies/new"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={20} />
            Add Company
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}
