import LoadingSpinner from '@/app/components/loading-spinner'

export default function Loading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-9 w-48 bg-neutral-200 rounded-lg animate-pulse"></div>
        <div className="h-5 w-64 bg-neutral-100 rounded mt-2 animate-pulse"></div>
      </div>
      <LoadingSpinner />
    </div>
  )
}
