import { getChallans } from '@/app/actions/challans'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import ChallanList from './challan-list'
import Search from './search'
import Pagination from './pagination'

export default async function ChallansPage({ searchParams }) {
  const { query = '', page = 1 } = await searchParams
  const currentPage = Number(page)
  
  const { data: challans, totalPages } = await getChallans({ 
    page: currentPage, 
    query 
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Delivery Challans</h1>
            <p className="text-neutral-600 mt-1">Create and manage delivery challans</p>
          </div>

          <Link
            href="/dashboard/challans/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Challan</span>
          </Link>
        </div>

        {/* Search Bar */}
        <Search placeholder="Search by challan no. or customer name..." />
      </div>

      {/* Challans List */}
      {!challans || challans.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <FileText size={48} className="mx-auto text-neutral-400 mb-4" />
          <p className="text-neutral-600 text-lg mb-4">
            {query ? 'No matching challans found' : 'No challans yet'}
          </p>
          {!query && (
            <Link
              href="/dashboard/challans/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors"
            >
              <Plus size={20} />
              Create First Challan
            </Link>
          )}
        </div>
      ) : (
        <>
          <ChallanList challans={challans} />
          <Pagination totalPages={totalPages} />
        </>
      )}
    </div>
  )
}
