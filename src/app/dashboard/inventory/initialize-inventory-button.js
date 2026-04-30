'use client'

import { initializeInventory } from '@/app/actions/inventory-generator'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InitializeInventoryButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleInitialize() {
    if (!confirm('This will generate all inventory combinations for all companies and products. Continue?')) {
      return
    }

    setIsLoading(true)
    
    try {
      const result = await initializeInventory()

      if (result.error) {
        alert('❌ Error initializing inventory:\n\n' + result.error + '\n\nPlease make sure you have run the database migration SQL first!')
      } else {
        alert(`✅ Success! Created ${result.totalCreated} inventory items.\n\nThe page will now refresh.`)
        router.refresh()
      }
    } catch (error) {
      alert('❌ Unexpected error:\n\n' + error.message + '\n\nPlease check the console for details.')
      console.error('Initialization error:', error)
    }
    
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleInitialize}
      disabled={isLoading}
      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
    >
      <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
      {isLoading ? 'Initializing...' : 'Initialize Inventory'}
    </button>
  )
}
