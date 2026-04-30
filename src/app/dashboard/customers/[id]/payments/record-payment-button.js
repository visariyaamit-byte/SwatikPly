'use client'

import { useState } from 'react'
import { recordPayment } from '@/app/actions/payments'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function RecordPaymentButton({ customerId, customerName, totalPending }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    const amount = parseFloat(formData.get('amount'))
    const paymentDate = formData.get('payment_date')
    const paymentMethod = formData.get('payment_method')
    const notes = formData.get('notes')

    const result = await recordPayment(customerId, amount, paymentDate, paymentMethod, notes)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Reset form and state
      e.target.reset()
      setLoading(false)
      setError(null)
      setIsOpen(false)
      // Refresh the page to show updated data
      router.refresh()
    }
  }

  // Reset state when modal closes
  const handleClose = () => {
    setIsOpen(false)
    setLoading(false)
    setError(null)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-brand text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors"
        disabled={totalPending <= 0}
      >
        Record Payment
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-brand">Record Payment</h2>
              <button
                onClick={handleClose}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm text-neutral-600">Customer</p>
              <p className="font-semibold text-lg">{customerName}</p>
              <p className="text-sm text-neutral-600 mt-2">Current Pending</p>
              <p className="font-bold text-xl text-orange-600">
                ₹{totalPending.toLocaleString('en-IN')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  max={totalPending}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="payment_date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="payment_method"
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                  placeholder="Add any notes..."
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
