import { createClient } from '@/lib/supabase/server'
import SalesReports from './sales-reports'
import { getProductTypes, getCompanies, getBoardGrades } from '@/app/actions/reports'

export default async function DashboardPage() {
  const supabase = await createClient()

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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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