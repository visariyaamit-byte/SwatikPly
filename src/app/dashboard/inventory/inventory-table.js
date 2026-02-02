'use client'

import { deleteInventoryItem, updateStock } from '@/app/actions/inventory'
import { Trash2, Edit, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EditInventoryModal from './edit-inventory-modal'
import StockUpdateModal from './stock-update-modal'

export default function InventoryTable({ items }) {
  const router = useRouter()
  const [editingItem, setEditingItem] = useState(null)
  const [updatingStock, setUpdatingStock] = useState(null)

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this inventory item?')) {
      return
    }

    const result = await deleteInventoryItem(id)
    
    if (result.error) {
      alert('Error deleting item: ' + result.error)
    } else {
      router.refresh()
    }
  }

  async function quickUpdate(id, change) {
    const type = change > 0 ? 'addition' : 'removal'
    const result = await updateStock(id, change, type, 'Quick update')
    
    if (result.error) {
      alert('Error updating stock: ' + result.error)
    } else {
      router.refresh()
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-600">
        No inventory items for this company yet.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900">Measurement</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900">Thickness</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900">Stock</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900">Min Stock</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900">Notes</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-neutral-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((item) => {
              const isLowStock = item.quantity <= item.minimum_stock
              
              return (
                <tr key={item.id} className={`hover:bg-neutral-50 transition-colors ${isLowStock ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-900">{item.measurement}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 bg-neutral-100 text-neutral-900 text-sm font-medium rounded-lg">
                      {item.thickness}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${isLowStock ? 'text-amber-600' : 'text-neutral-900'}`}>
                        {item.quantity}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => quickUpdate(item.id, -1)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove 1"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          onClick={() => quickUpdate(item.id, 1)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Add 1"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-600">{item.minimum_stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-neutral-500">{item.notes || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setUpdatingStock(item)}
                        className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Update Stock
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditInventoryModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Stock Update Modal */}
      {updatingStock && (
        <StockUpdateModal
          item={updatingStock}
          onClose={() => setUpdatingStock(null)}
        />
      )}
    </>
  )
}
