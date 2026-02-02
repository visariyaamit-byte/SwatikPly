'use client'

import { useState } from 'react'
import { createChallan } from '@/app/actions/challans'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Package } from 'lucide-react'

export default function CreateChallanForm({ nextChallanNumber, inventory }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form fields
  const [customerName, setCustomerName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState([])
  const [cgstPercentage, setCgstPercentage] = useState(0)
  const [sgstPercentage, setSgstPercentage] = useState(0)
  const [transportCharges, setTransportCharges] = useState(0)

  // Add item from inventory
  function addInventoryItem(inventoryId) {
    const inventoryItem = inventory.find(i => i.id === inventoryId)
    if (!inventoryItem) return

    // Build description
    let description = ''
    if (inventoryItem.product_type === 'Plywood') {
      description = `${inventoryItem.company?.name} Plywood ${inventoryItem.measurement} ${inventoryItem.thickness}`
    } else if (inventoryItem.product_type === 'Board') {
      description = `${inventoryItem.grade} Board ${inventoryItem.measurement} ${inventoryItem.thickness}`
    } else if (inventoryItem.product_type === 'MDF') {
      description = `${inventoryItem.grade} MDF ${inventoryItem.thickness}`
    } else if (inventoryItem.product_type === 'Flexi') {
      description = `${inventoryItem.grade} Flexi ${inventoryItem.thickness}`
    }

    const newItem = {
      id: Date.now(),
      inventory_id: inventoryItem.id,
      description,
      quantity: 1,
      rate: 0,
      amount: 0,
      maxQuantity: inventoryItem.quantity
    }

    setItems([...items, newItem])
  }

  // Add custom item
  function addCustomItem() {
    const newItem = {
      id: Date.now(),
      inventory_id: null,
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      maxQuantity: null
    }

    setItems([...items, newItem])
  }

  // Update item
  function updateItem(id, field, value) {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        
        // Auto-calculate amount
        if (field === 'quantity' || field === 'rate') {
          updated.amount = (updated.quantity || 0) * (updated.rate || 0)
        }
        
        return updated
      }
      return item
    }))
  }

  // Remove item
  function removeItem(id) {
    setItems(items.filter(item => item.id !== id))
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0)
  const cgstAmount = (subtotal * cgstPercentage) / 100
  const sgstAmount = (subtotal * sgstPercentage) / 100
  const total = subtotal + cgstAmount + sgstAmount + transportCharges

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault()

    if (items.length === 0) {
      alert('Please add at least one item')
      return
    }

    // Validate inventory quantities
    for (const item of items) {
      if (item.inventory_id && item.quantity > item.maxQuantity) {
        alert(`Insufficient stock for ${item.description}. Available: ${item.maxQuantity}`)
        return
      }
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('customer_name', customerName)
    formData.append('date', date)
    formData.append('cgst_percentage', cgstPercentage)
    formData.append('sgst_percentage', sgstPercentage)
    formData.append('transport_charges', transportCharges)
    formData.append('items', JSON.stringify(items.map(item => ({
      inventory_id: item.inventory_id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount
    }))))

    const result = await createChallan(formData)

    if (result.error) {
      alert('Error: ' + result.error)
      setIsSubmitting(false)
    } else {
      router.push(`/dashboard/challans/${result.challanId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-8">
      {/* Header Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Challan Number */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Challan No.
          </label>
          <input
            type="text"
            value={nextChallanNumber}
            disabled
            className="w-full px-4 py-3 bg-neutral-100 border border-neutral-300 rounded-xl font-mono font-bold text-lg"
          />
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            M/s (Customer Name) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter customer name"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Add Item Buttons */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Add from Inventory
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addInventoryItem(e.target.value)
                e.target.value = ''
              }
            }}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select inventory item...</option>
            {inventory.map(item => {
              let label = ''
              if (item.product_type === 'Plywood') {
                label = `${item.company?.name} Plywood ${item.measurement} ${item.thickness} (Stock: ${item.quantity})`
              } else if (item.product_type === 'Board') {
                label = `${item.grade} Board ${item.measurement} ${item.thickness} (Stock: ${item.quantity})`
              } else if (item.product_type === 'MDF') {
                label = `${item.grade} MDF ${item.thickness} (Stock: ${item.quantity})`
              } else if (item.product_type === 'Flexi') {
                label = `${item.grade} Flexi ${item.thickness} (Stock: ${item.quantity})`
              }
              return (
                <option key={item.id} value={item.id}>{label}</option>
              )
            })}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={addCustomItem}
            className="flex items-center gap-2 px-5 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Add Custom Item
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Items</h3>
        
        {items.length === 0 ? (
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center">
            <Package size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600">No items added yet</p>
            <p className="text-neutral-500 text-sm mt-2">Add items from inventory or create custom entries</p>
          </div>
        ) : (
          <>
            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Description</label>
                    {item.inventory_id ? (
                      <div>
                        <div className="font-medium text-neutral-900">{item.description}</div>
                        <div className="text-sm text-neutral-500 mt-1">
                          Available: {item.maxQuantity}
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Enter description"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                    )}
                  </div>

                  {/* Qty & Rate Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Qty</label>
                      <input
                        type="number"
                        min="1"
                        max={item.maxQuantity || undefined}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Rate</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Amount & Action */}
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase">Amount</label>
                      <span className="text-lg font-bold text-neutral-900">₹{item.amount.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Summary Section */}
            <div className="md:hidden mt-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">CGST %</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cgstPercentage}
                    onChange={(e) => setCgstPercentage(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-neutral-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="0"
                  />
                </div>
                <span>₹{cgstAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">SGST %</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={sgstPercentage}
                    onChange={(e) => setSgstPercentage(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-neutral-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="0"
                  />
                </div>
                <span>₹{sgstAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm gap-4">
                <span className="text-neutral-600">Transport</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={transportCharges}
                    onChange={(e) => setTransportCharges(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-neutral-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-neutral-300 font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold w-32">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold w-32">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold w-32">Amount</th>
                    <th className="px-4 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        {item.inventory_id ? (
                          <div>
                            <div className="font-medium">{item.description}</div>
                            <div className="text-sm text-neutral-500">
                              From inventory (Available: {item.maxQuantity})
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Enter description"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          max={item.maxQuantity || undefined}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-neutral-50">
                <tr className="border-t border-neutral-200">
                  <td colSpan="3" className="px-4 py-2 text-right text-sm">
                    Subtotal
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-neutral-600">CGST %</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={cgstPercentage}
                        onChange={(e) => setCgstPercentage(parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm text-center"
                        placeholder="0"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-sm">
                    CGST ({cgstPercentage}%)
                  </td>
                  <td className="px-4 py-2 text-right">
                    ₹{cgstAmount.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-neutral-600">SGST %</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={sgstPercentage}
                        onChange={(e) => setSgstPercentage(parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm text-center"
                        placeholder="0"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-sm">
                    SGST ({sgstPercentage}%)
                  </td>
                  <td className="px-4 py-2 text-right">
                    ₹{sgstAmount.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-neutral-600">Transport</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={transportCharges}
                        onChange={(e) => setTransportCharges(parseFloat(e.target.value) || 0)}
                        className="w-32 px-2 py-1 border border-neutral-300 rounded text-sm text-right"
                        placeholder="0.00"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-sm">
                    Transport Charges
                  </td>
                  <td className="px-4 py-2 text-right">
                    ₹{transportCharges.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
                <tr className="border-t-2 border-neutral-300">
                  <td colSpan="3" className="px-4 py-4 text-right font-semibold text-lg">
                    Total
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-xl">
                    ₹{total.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          </>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Challan'}
        </button>
      </div>
    </form>
  )
}
