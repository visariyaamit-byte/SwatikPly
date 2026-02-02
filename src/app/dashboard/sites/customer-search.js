'use client'

import { searchCustomers } from '@/app/actions/sites'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/lib/hooks/use-debounce'

export default function CustomerSearch({ onSelectCustomer }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isCustomerSelected, setIsCustomerSelected] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    async function search() {
      if (debouncedQuery.length < 2 || isCustomerSelected) {
        setResults([])
        return
      }

      setIsSearching(true)
      const customers = await searchCustomers(debouncedQuery)
      setResults(customers)
      setIsSearching(false)
      setShowResults(true)
    }

    search()
  }, [debouncedQuery, isCustomerSelected])

  function handleSelect(customer) {
    onSelectCustomer(customer)
    setQuery(customer.name)
    setResults([])
    setShowResults(false)
    setIsCustomerSelected(true)
  }

  function handleInputChange(e) {
    setQuery(e.target.value)
    setIsCustomerSelected(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0 && query.length >= 2 && !isCustomerSelected) {
              setShowResults(true)
            }
          }}
          placeholder="Search customer by name, phone, or email..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && !isCustomerSelected && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {results.map((customer) => (
            <button
              key={customer.id}
              onClick={() => handleSelect(customer)}
              className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
            >
              <p className="font-medium text-neutral-900">{customer.name}</p>
              <p className="text-sm text-neutral-600">{customer.phone}</p>
              {customer.email && (
                <p className="text-sm text-neutral-500">{customer.email}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && query.length >= 2 && results.length === 0 && !isSearching && !isCustomerSelected && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg p-4">
          <p className="text-neutral-600 text-center">No customers found</p>
        </div>
      )}
    </div>
  )
}

