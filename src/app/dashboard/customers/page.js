import { getCustomers } from '@/app/actions/customers'
import { getUserRole } from '@/app/actions/auth'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import CustomerList from './customer-list'

export default async function CustomersPage() {
  const customers = await getCustomers()
  const userRole = await getUserRole()
  const isManager = userRole === 'manager'

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">Customers</h1>
          <p className="text-neutral-600 mt-1">Manage your customer database</p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors"
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
            className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors"
          >
            <Plus size={20} />
            Add Your First Customer
          </Link>
        </div>
      ) : (
        <CustomerList customers={customers} isManager={isManager} />
      )}
    </div>
  )
}
