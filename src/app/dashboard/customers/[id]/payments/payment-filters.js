'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function PaymentFilters({ customerId }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('filter') || 'all'
  const currentYear = searchParams.get('year')
  
  const [selectedYear, setSelectedYear] = useState(currentYear || new Date().getFullYear().toString())
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')

  const filters = [
    { value: 'all', label: 'All Time' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'year', label: 'Year' },
    { value: 'custom', label: 'Custom Range' },
  ]

  const handleFilterChange = (filterValue) => {
    const params = new URLSearchParams(searchParams)
    
    if (filterValue === 'all') {
      params.delete('filter')
      params.delete('year')
      params.delete('startDate')
      params.delete('endDate')
    } else if (filterValue === 'year') {
      params.set('filter', filterValue)
      params.set('year', selectedYear)
      params.delete('startDate')
      params.delete('endDate')
    } else if (filterValue === 'custom') {
      params.set('filter', filterValue)
      params.delete('year')
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
    } else {
      params.set('filter', filterValue)
      params.delete('year')
      params.delete('startDate')
      params.delete('endDate')
    }
    
    router.push(`/dashboard/customers/${customerId}/payments?${params.toString()}`)
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
    const params = new URLSearchParams(searchParams)
    params.set('filter', 'year')
    params.set('year', year)
    params.delete('startDate')
    params.delete('endDate')
    router.push(`/dashboard/customers/${customerId}/payments?${params.toString()}`)
  }

  const handleCustomDateApply = () => {
    const params = new URLSearchParams(searchParams)
    params.set('filter', 'custom')
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    params.delete('year')
    router.push(`/dashboard/customers/${customerId}/payments?${params.toString()}`)
  }

  // Generate year options (last 5 years)
  const currentYearNum = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYearNum - i)

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {filters.map((filter) => (
        <div key={filter.value} className="flex items-center gap-2">
          <button
            onClick={() => handleFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentFilter === filter.value
                ? 'bg-brand text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {filter.label}
          </button>
          
          {filter.value === 'year' && currentFilter === 'year' && (
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
          
          {filter.value === 'custom' && currentFilter === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Start Date"
              />
              <span className="text-neutral-600">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="End Date"
              />
              <button
                onClick={handleCustomDateApply}
                className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
