import LoadingSpinner from '@/app/components/loading-spinner'

export default function Loading() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-48 bg-neutral-200 rounded-lg animate-pulse"></div>
        <div className="h-5 w-80 bg-neutral-100 rounded mt-2 animate-pulse"></div>
      </div>

      {/* Search Box Skeleton */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6">
        <div className="h-5 w-32 bg-neutral-200 rounded mb-3 animate-pulse"></div>
        <div className="h-10 bg-neutral-100 rounded-lg animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-12">
        <LoadingSpinner />
      </div>
    </div>
  )
}
