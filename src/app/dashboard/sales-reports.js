'use client'

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { 
  getProductsByCompany, 
  getProductsByGrade, 
  getProductSales,
  getSalesByType,
  getSalesByCompany,
  getSalesByBoardGrade,
  getGradesByType
} from '@/app/actions/reports'

export default function SalesReports({ productTypes, companies, boardGrades }) {
  const [selectedType, setSelectedType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('') // Company or Grade
  const [availableCategories, setAvailableCategories] = useState([]) // Dynamic categories
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [salesData, setSalesData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Reset and load categories when type changes
  useEffect(() => {
    setSelectedCategory('')
    setProducts([])
    setSelectedProduct('')
    setSalesData(null)
    
    // Load appropriate categories based on type
    if (selectedType === 'Plywood') {
      setAvailableCategories(companies)
    } else if (['Board', 'MDF', 'Flexi'].includes(selectedType)) {
      loadGradesForType()
    } else {
      setAvailableCategories([])
    }
    
    // Load sales for just the type if selected
    if (selectedType) {
      loadSalesForType()
    }
  }, [selectedType])

  async function loadGradesForType() {
    const result = await getGradesByType(selectedType)
    setAvailableCategories(result.data.map(g => ({ id: g, name: g })))
  }

  // Load products when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadProducts()
      loadSalesForCategory()
    } else if (selectedType) {
      // Reset to type-level sales
      loadSalesForType()
    } else {
      setProducts([])
      setSelectedProduct('')
      setSalesData(null)
    }
  }, [selectedCategory])

  // Load sales when product changes
  useEffect(() => {
    if (selectedProduct) {
      loadSalesForProduct()
    } else if (selectedCategory) {
      // Reset to category-level sales
      loadSalesForCategory()
    } else if (selectedType) {
      // Reset to type-level sales
      loadSalesForType()
    }
  }, [selectedProduct])

  async function loadSalesForType() {
    setLoading(true)
    const result = await getSalesByType(selectedType)
    setSalesData(result)
    setLoading(false)
  }

  async function loadSalesForCategory() {
    setLoading(true)
    let result
    
    if (selectedType === 'Plywood') {
      result = await getSalesByCompany(selectedCategory)
    } else if (['Board', 'MDF', 'Flexi'].includes(selectedType)) {
      result = await getSalesByBoardGrade(selectedCategory)
    }
    
    setSalesData(result)
    setLoading(false)
  }

  async function loadSalesForProduct() {
    setLoading(true)
    const result = await getProductSales(selectedProduct)
    setSalesData(result)
    setLoading(false)
  }

  async function loadProducts() {
    setLoading(true)
    let result
    
    if (selectedType === 'Plywood') {
      result = await getProductsByCompany(selectedCategory)
    } else if (['Board', 'MDF', 'Flexi'].includes(selectedType)) {
      result = await getProductsByGrade(selectedCategory)
    }
    
    setProducts(result?.data || [])
    setSelectedProduct('')
    setLoading(false)
  }

  function getProductLabel(product) {
    // MDF and Flexi don't use measurement field, only thickness
    if (product.measurement && product.measurement !== 'null') {
      return `${product.measurement} × ${product.thickness}`
    }
    // For MDF/Flexi, just show thickness
    return product.thickness
  }

  // Determine what to show in second dropdown
  const isGradeBased = ['Board', 'MDF', 'Flexi'].includes(selectedType)
  const secondDropdownLabel = selectedType === 'Plywood' 
    ? 'Select Company' 
    : isGradeBased 
      ? `Select ${selectedType} Type` 
      : 'Select Category'

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
        <div className="bg-brand text-white p-2 rounded-lg">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-brand">Sales Reports</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Product Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            1. Product Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          >
            <option value="">-- Choose Type --</option>
            {productTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Category Dropdown (Company or Grade) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            2. {secondDropdownLabel}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedType || availableCategories.length === 0}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Choose {selectedType === 'Plywood' ? 'Company' : 'Type'} --</option>
            {availableCategories.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Product Dropdown */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            3. Specific Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            disabled={!selectedCategory || products.length === 0}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Choose Product --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {getProductLabel(product)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 bg-neutral-50 rounded-xl">
          <div className="inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-medium text-neutral-600">Loading...</p>
        </div>
      )}

      {/* Sales Results */}
      {!loading && salesData && (
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          {/* Total Summary */}
          <div className="bg-brand text-white p-6">
            <h3 className="text-lg font-bold mb-4">Total Sales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-300 mb-1">Total Quantity Sold</p>
                <p className="text-4xl font-bold">{salesData.totalQuantity}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-300 mb-1">Total Revenue</p>
                <p className="text-4xl font-bold">₹{salesData.totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Sales Details Table */}
          {salesData.data && salesData.data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Challan #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase">Customer</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase">Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {salesData.data.map((sale) => (
                    <tr key={sale.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-neutral-900">
                        {sale.challan?.challan_number}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {sale.challan?.date ? new Date(sale.challan.date).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-4 py-3 text-neutral-900">
                        {sale.challan?.customer_name}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                        {sale.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-600">
                        {sale.rate ? `₹${sale.rate.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-neutral-900">
                        ₹{sale.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No Sales Message */}
          {salesData.data && salesData.data.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-lg font-medium text-neutral-600">No sales found for this product</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !salesData && (
        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
          <p className="text-neutral-600 font-medium">Select a product to view sales data</p>
          <p className="text-sm text-neutral-500 mt-2">Choose product type, then category, then specific product</p>
        </div>
      )}
    </div>
  )
}
