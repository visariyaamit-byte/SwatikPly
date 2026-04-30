import LoadingSpinner from '@/app/components/loading-spinner'

export default function Loading() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-9 w-48 bg-neutral-200 rounded-lg animate-pulse"></div>
          <div className="h-5 w-64 bg-neutral-100 rounded mt-2 animate-pulse"></div>
        </div>
        <div className="h-10 w-36 bg-neutral-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {[1, 2, 3, 4, 5].map((col) => (
                    <td key={col} className="px-6 py-4">
                      <div className="h-4 bg-neutral-100 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
