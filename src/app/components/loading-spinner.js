export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-neutral-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}
