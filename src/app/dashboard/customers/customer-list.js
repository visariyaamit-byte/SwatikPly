'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { formatDate, formatPhone } from '@/lib/utils'
import DeleteCustomerButton from './delete-button'

export default function CustomerList({ customers, isManager }) {
  const [search, setSearch] = useState('')

  const filtered = customers.filter(customer => {
    const q = search.toLowerCase()
    return (
      customer.name.toLowerCase().includes(q) ||
      (customer.phone && customer.phone.includes(q)) ||
      (customer.email && customer.email.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Email</th>
                {isManager && (
                  <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Pending Payment</th>
                )}
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Added</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="px-6 py-12 text-center text-neutral-500">
                    {search ? 'No customers match your search' : 'No customers yet'}
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-neutral-900">{customer.name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-neutral-700">{formatPhone(customer.phone)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-neutral-600">{customer.email || '—'}</p>
                    </td>
                    {isManager && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.total_pending > 0 ? (
                          <Link
                            href={`/dashboard/customers/${customer.id}/payments`}
                            className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            ₹{customer.total_pending.toLocaleString('en-IN')}
                          </Link>
                        ) : (
                          <span className="text-green-600 font-medium">₹0</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-neutral-500">{formatDate(customer.created_at)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/customers/${customer.id}/edit`}
                          className="px-3 py-1.5 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        {isManager && (
                          <DeleteCustomerButton id={customer.id} name={customer.name} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
