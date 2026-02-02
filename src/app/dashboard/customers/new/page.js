import { createCustomer } from '@/app/actions/customers'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewCustomerPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Customers
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
        <p className="text-neutral-600 mt-1">Create a new customer record</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-2xl">
        <form action={createCustomer} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter customer name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="9876543210"
            />
            <p className="text-xs text-neutral-500 mt-1">10-digit mobile number</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address <span className="text-neutral-400">(Optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="customer@example.com"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Add Customer
            </button>
            <Link
              href="/dashboard/customers"
              className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
