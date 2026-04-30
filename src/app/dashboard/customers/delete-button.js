'use client'

import { deleteCustomer } from '@/app/actions/customers'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteCustomerButton({ id, name }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteCustomer(id)
    
    if (result.error) {
      alert('Error deleting customer: ' + result.error)
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
    >
      {isDeleting ? 'Deleting...' : (
        <>
          <Trash2 size={16} />
          Delete
        </>
      )}
    </button>
  )
}
