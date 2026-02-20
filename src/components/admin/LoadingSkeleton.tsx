export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Search bar skeleton */}
      <div className="p-4 border-b border-gray-100 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-full max-w-sm" />
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-gray-50 animate-pulse flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
        </div>
      ))}
    </div>
  )
}
