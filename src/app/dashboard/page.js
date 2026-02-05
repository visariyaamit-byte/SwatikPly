import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/app/actions/auth'
import SalesReports from './sales-reports'
import { getProductTypes, getCompanies, getBoardGrades } from '@/app/actions/reports'
import { ShieldAlert } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const userRole = await getUserRole()
  const isManager = userRole === 'manager'

  // Only fetch sales data if user is manager
  if (!isManager) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-brand">Dashboard</h1>
          <p className="text-neutral-600 mt-1">Welcome to your dashboard</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert size={48} className="text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Access Restricted</h2>
          <p className="text-neutral-600">
            Sales reports are only available to managers.
          </p>
        </div>
      </div>
    )
  }

  const [
    productTypesResult,
    companiesResult,
    gradesResult
  ] = await Promise.all([
    getProductTypes(),
    getCompanies(),
    getBoardGrades()
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-brand">Dashboard</h1>
        <p className="text-neutral-600 mt-1">Sales analytics and reports</p>
      </div>

      {/* Sales Reports Section */}
      <SalesReports 
        productTypes={productTypesResult.data || []} 
        companies={companiesResult.data || []}
        boardGrades={gradesResult.data || []}
      />
    </div>
  )
}