import { getSite, deleteSite } from '@/app/actions/sites'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Edit, Trash2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import AddLaminateForm from './add-laminate-form'
import LaminateTable from './laminate-table'
import DeleteSiteButton from './delete-site-button'

export default async function SiteDetailsPage({ params }) {
  const { id } = await params
  const site = await getSite(id)

  if (!site) {
    notFound()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/sites"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Sites
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{site.flat_number}</h1>
            <p className="text-neutral-600 mt-1">{site.address}</p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/dashboard/sites/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <Edit size={16} />
              Edit Site
            </Link>
            <DeleteSiteButton siteId={id} flatNumber={site.flat_number} />
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-600">Customer</p>
            <p className="font-semibold text-neutral-900">{site.customer.name}</p>
            <p className="text-sm text-neutral-600">{site.customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Laminate Entries Section */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Laminate Entries</h2>
            <p className="text-sm text-neutral-600 mt-1">
              {site.laminate_entries?.length || 0} room(s) configured
            </p>
          </div>
        </div>

        {/* Add Laminate Form */}
        <AddLaminateForm siteId={id} />

        {/* Laminate Table */}
        <div className="mt-6">
          <LaminateTable siteId={id} laminates={site.laminate_entries || []} />
        </div>
      </div>
    </div>
  )
}
