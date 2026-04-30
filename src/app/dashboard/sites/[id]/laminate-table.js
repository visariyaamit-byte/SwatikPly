'use client'

import { deleteLaminate } from '@/app/actions/laminates'
import { formatDate } from '@/lib/utils'
import { Trash2, Edit } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EditLaminateModal from './edit-laminate-modal'

export default function LaminateTable({ siteId, laminates }) {
  const router = useRouter()
  const [editingLaminate, setEditingLaminate] = useState(null)

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this laminate entry?')) {
      return
    }

    const result = await deleteLaminate(id, siteId)
    
    if (result.error) {
      alert('Error deleting laminate: ' + result.error)
    } else {
      router.refresh()
    }
  }

  if (laminates.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-600">
        No laminate entries yet. Add your first entry above.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">Room</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">Model</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">Description</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">Date</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">Notes</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {laminates.map((laminate) => (
              <tr key={laminate.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 bg-neutral-100 text-neutral-900 text-sm font-medium rounded-lg">
                    {laminate.room}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{laminate.model_name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-neutral-700 text-sm">{laminate.description}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-neutral-600">{formatDate(laminate.date)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-neutral-500">{laminate.notes || '—'}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setEditingLaminate(laminate)}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(laminate.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingLaminate && (
        <EditLaminateModal
          laminate={editingLaminate}
          siteId={siteId}
          onClose={() => setEditingLaminate(null)}
        />
      )}
    </>
  )
}
