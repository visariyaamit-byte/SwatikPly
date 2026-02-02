'use client'

import { getSitesByCustomer } from '@/app/actions/sites'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { MapPin, Calendar, ArrowUpDown, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SitesList({ customerId }) {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('desc')
  const [dateFilter, setDateFilter] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')

  useEffect(() => {
    async function loadSites() {
      setLoading(true)
      const data = await getSitesByCustomer(customerId, sortOrder)
      setSites(data)
      setLoading(false)
    }

    if (customerId) {
      loadSites()
    }
  }, [customerId, sortOrder])

  function toggleSort() {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
  }

  function handleFilterChange(value) {
    setDateFilter(value)
    // Reset custom filters when changing filter type
    if (value !== 'custom') {
      setCustomStartDate('')
      setCustomEndDate('')
    }
    if (value !== 'year') {
      setSelectedYear('')
    }
    if (value !== 'month') {
      setSelectedMonth('')
    }
  }

  function clearFilters() {
    setDateFilter('all')
    setCustomStartDate('')
    setCustomEndDate('')
    setSelectedYear('')
    setSelectedMonth('')
  }

  // Get available years from sites
  const availableYears = [...new Set(sites.map(site => 
    new Date(site.created_at).getFullYear()
  ))].sort((a, b) => b - a)

  // Filter sites by date
  const filteredSites = sites.filter(site => {
    if (dateFilter === 'all') return true
    
    const siteDate = new Date(site.created_at)
    const now = new Date()
    
    if (dateFilter === 'today') {
      return siteDate.toDateString() === now.toDateString()
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return siteDate >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return siteDate >= monthAgo
    } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate)
      const end = new Date(customEndDate)
      end.setHours(23, 59, 59, 999) // Include entire end date
      return siteDate >= start && siteDate <= end
    } else if (dateFilter === 'year' && selectedYear) {
      return siteDate.getFullYear() === parseInt(selectedYear)
    } else if (dateFilter === 'monthYear' && selectedMonth) {
      const [year, month] = selectedMonth.split('-')
      return siteDate.getFullYear() === parseInt(year) && 
             siteDate.getMonth() === parseInt(month) - 1
    }
    
    return true
  })

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
        <p className="text-neutral-600">Loading sites...</p>
      </div>
    )
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
        <p className="text-neutral-600 mb-4">No sites found for this customer</p>
        <Link
          href={`/dashboard/sites/new?customer=${customerId}`}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
        >
          Add First Site
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={toggleSort}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <ArrowUpDown size={16} />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>

            <select
              value={dateFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">By Year</option>
              <option value="monthYear">By Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter !== 'all' && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>

          <p className="text-sm text-neutral-600">
            {filteredSites.length} {filteredSites.length === 1 ? 'site' : 'sites'}
          </p>
        </div>

        {/* Year Filter */}
        {dateFilter === 'year' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Select Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Choose year</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}

        {/* Month Filter */}
        {dateFilter === 'monthYear' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        )}

        {/* Custom Date Range */}
        {dateFilter === 'custom' && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">From:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">To:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => (
          <Link
            key={site.id}
            href={`/dashboard/sites/${site.id}`}
            className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-lg hover:border-neutral-300 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-neutral-600" />
                <h3 className="font-semibold text-neutral-900">
                  {site.flat_number}
                </h3>
              </div>
              <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg">
                {site.laminate_entries?.[0]?.count || 0} rooms
              </span>
            </div>

            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
              {site.address}
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Calendar size={14} />
              {formatDate(site.created_at)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

