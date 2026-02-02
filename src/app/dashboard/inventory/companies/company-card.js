'use client'

import { deleteCompany } from '@/app/actions/companies'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CompanyCard({ company }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${company.name}"? This will also delete all inventory items for this company.`)) {
      return
    }

    const result = await deleteCompany(company.id)
    
    if (result.error) {
      alert('Error deleting company: ' + result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-neutral-900">{company.name}</h3>
        <div className="flex gap-1">
          <Link
            href={`/dashboard/inventory/companies/${company.id}/edit`}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm text-neutral-500">
        Created {new Date(company.created_at).toLocaleDateString()}
      </p>
    </div>
  )
}
