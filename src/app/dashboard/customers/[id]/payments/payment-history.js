'use client'

import { useState } from 'react'
import { deletePayment } from '@/app/actions/payments'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

export default function PaymentHistory({ payments, customerId }) {
  const [deletingId, setDeletingId] = useState(null)
  const router = useRouter()

  const handleDelete = async (paymentId) => {
    if (!confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
      return
    }

    setDeletingId(paymentId)
    const result = await deletePayment(paymentId)

    if (result.error) {
      alert(`Error: ${result.error}`)
      setDeletingId(null)
    } else {
      router.refresh()
    }
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">No payments recorded yet</p>
        <p className="text-sm text-neutral-500 mt-2">
          Click "Record Payment" to add a payment
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-neutral-200">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Method</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900">Notes</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-neutral-50">
              <td className="py-3 px-4 text-neutral-700">
                {formatDate(payment.payment_date)}
              </td>
              <td className="py-3 px-4 font-semibold text-green-600">
                ₹{parseFloat(payment.amount).toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-4 text-neutral-700">
                {payment.payment_method}
              </td>
              <td className="py-3 px-4 text-neutral-600 text-sm">
                {payment.notes || '—'}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => handleDelete(payment.id)}
                  disabled={deletingId === payment.id}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 size={16} />
                  {deletingId === payment.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
