export default function Loading() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-64 bg-neutral-200 rounded-lg animate-pulse"></div>
        <div className="h-5 w-80 bg-neutral-100 rounded mt-2 animate-pulse"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border-2 border-neutral-200 rounded-2xl p-6">
            <div className="w-12 h-12 bg-neutral-200 rounded-xl mb-4 animate-pulse"></div>
            <div className="h-6 bg-neutral-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-neutral-100 rounded mb-4 animate-pulse"></div>
            <div className="flex items-baseline gap-2">
              <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
