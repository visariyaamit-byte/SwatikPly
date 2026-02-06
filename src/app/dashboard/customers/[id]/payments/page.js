import { getCustomerWithPaymentDetails } from '@/app/actions/customers'
import { getPaymentsByCustomer } from '@/app/actions/payments'
import { getUserRole } from '@/app/actions/auth'
import { formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RecordPaymentButton from './record-payment-button'
import PaymentFilters from './payment-filters'
import PaymentHistory from './payment-history'

export default async function CustomerPaymentsPage({ params, searchParams }) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  
  // Check if user is manager
  const userRole = await getUserRole()
  if (userRole !== 'manager') {
    redirect('/dashboard/customers')
  }

  // Extract filter parameters
  const filter = resolvedSearchParams?.filter || 'all'
  const year = resolvedSearchParams?.year
  const startDate = resolvedSearchParams?.startDate
  const endDate = resolvedSearchParams?.endDate
  
  // Get customer with payment details (filtered)
  const result = await getCustomerWithPaymentDetails(id, { filter, year, startDate, endDate })
  
  if (result.error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{result.error}</p>
        <Link href="/dashboard/customers" className="text-brand hover:text-brand-dark hover:underline mt-4 inline-block font-medium">
          Back to Customers
        </Link>
      </div>
    )
  }

  const { customer, challans, total_billed, total_paid, total_pending } = result

  // Get payments with same filters
  const paymentsResult = await getPaymentsByCustomer(id, { filter, year, startDate, endDate })
  const payments = paymentsResult.data || []

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-brand hover:text-brand-dark mb-4 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Customers
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">{customer.name}</h1>
            <p className="text-neutral-600 mt-1">Payment tracking and history</p>
          </div>
          
          <RecordPaymentButton 
            customerId={id} 
            customerName={customer.name}
            totalPending={total_pending}
          />
        </div>
      </div>

      {/* Account Summary with Filters */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand">Account Summary</h2>
          <PaymentFilters customerId={id} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 rounded-xl p-6">
            <p className="text-sm font-medium text-neutral-600 mb-2">Total Billed</p>
            <p className="text-3xl font-bold text-neutral-900">
              ₹{total_billed.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <p className="text-sm font-medium text-green-700 mb-2">Total Paid</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{total_paid.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
            <p className="text-sm font-medium text-orange-700 mb-2">Total Pending</p>
            <p className="text-3xl font-bold text-orange-600">
              ₹{total_pending.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Challans List */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-brand mb-4">Challans</h2>
        
        {challans.length === 0 ? (
          <p className="text-neutral-600 text-center py-8">No challans found for this customer</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Challan #</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-900">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {challans.map((challan) => (
                  <tr key={challan.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-medium text-neutral-900">
                      {challan.challan_number}
                    </td>
                    <td className="py-3 px-4 text-neutral-700">
                      {formatDate(challan.date)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-neutral-900">
                      ₹{parseFloat(challan.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/dashboard/challans/${challan.id}`}
                        className="text-brand hover:text-brand-dark text-sm font-medium hover:underline transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment History Section */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-brand mb-6">Payment History</h2>
        <PaymentHistory payments={payments} customerId={id} />
      </div>
    </div>
  )
}
