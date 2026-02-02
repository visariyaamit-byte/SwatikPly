import { getCustomers } from '@/app/actions/customers'
import { formatDate, formatPhone } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DeleteCustomerButton from './delete-button'

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-neutral-600 mt-1">Manage your customer database</p>
        </div>
        
        <Link
          href="/dashboard/customers/new"
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus size={20} />
          Add Customer
        </Link>
      </div>

      {/* Customer List */}
      {customers.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <p className="text-neutral-600 mb-4">No customers yet</p>
          <Link
            href="/dashboard/customers/new"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={20} />
            Add Your First Customer
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Added</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-900 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {customers.map((customer) => (
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
                        <DeleteCustomerButton id={customer.id} name={customer.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
