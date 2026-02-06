'use client'

import Link from 'next/link'
import { Eye, Trash2 } from 'lucide-react'
import { deleteChallan } from '@/app/actions/challans'
import { useRouter } from 'next/navigation'

export default function ChallanList({ challans, userRole }) {
  const router = useRouter()

  async function handleDelete(id, challanNumber) {
    if (!confirm(`Delete challan #${challanNumber}? This will NOT restore inventory.`)) {
      return
    }

    const result = await deleteChallan(id)
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Challan No.</th>
              <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Customer (M/s)</th>
              <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Items</th>
              <th className="px-6 py-4 text-right text-sm font-semibold whitespace-nowrap">Total Amount</th>
              <th className="px-6 py-4 text-right text-sm font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {challans.map((challan) => (
              <tr key={challan.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-mono font-semibold whitespace-nowrap">#{challan.challan_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{challan.customer_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(challan.date).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">
                  {challan.challan_items?.length || 0} items
                </td>
                <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                  ₹{challan.total_amount?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/challans/${challan.id}`}
                      className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                      title="View/Print"
                    >
                      <Eye size={18} />
                    </Link>
                    {userRole === 'manager' && (
                      <button
                        onClick={() => handleDelete(challan.id, challan.challan_number)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
