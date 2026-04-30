'use client'

import { deleteSite } from '@/app/actions/sites'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteSiteButton({ siteId, flatNumber }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${flatNumber}"? This will also delete all laminate entries.`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteSite(siteId)
    
    if (result.error) {
      alert('Error deleting site: ' + result.error)
      setIsDeleting(false)
    } else {
      router.push('/dashboard/sites')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 size={16} />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
