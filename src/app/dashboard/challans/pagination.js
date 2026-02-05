'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Pagination({ totalPages }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Previous Button */}
      <div className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}>
        <Link
          href={createPageURL(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      </div>

      <div className="text-sm font-medium text-neutral-600">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      <div className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}>
        <Link
          href={createPageURL(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
