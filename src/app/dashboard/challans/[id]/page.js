import { getChallan } from '@/app/actions/challans'
import Link from 'next/link'
import { ArrowLeft, Printer, Edit } from 'lucide-react'
import ChallanPrint from './challan-print'
import { notFound } from 'next/navigation'
import './print-styles.css'

export default async function ChallanViewPage({ params }) {
  const { id } = await params
  const challan = await getChallan(id)

  if (!challan) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8 print:hidden">
        <Link
          href="/dashboard/challans"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Challans
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">
              Challan #{challan.challan_number}
            </h1>
            <p className="text-neutral-600 mt-1">
              {challan.customer_name} • {new Date(challan.date).toLocaleDateString('en-IN')}
            </p>
          </div>

          <Link
            href={`/dashboard/challans/${id}/edit`}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-colors"
          >
            <Edit size={18} />
            Edit Challan
          </Link>
        </div>
      </div>

      <ChallanPrint challan={challan} />
    </div>
  )
}
