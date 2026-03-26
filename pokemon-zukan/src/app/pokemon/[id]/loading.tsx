export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse" />

      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="flex flex-col items-center mb-6">
          <div className="w-48 h-48 bg-gray-200 rounded-full mb-4" />
          <div className="h-5 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </div>
        </div>

        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-24 mb-3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-12 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-12 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>

        <div>
          <div className="h-6 bg-gray-200 rounded w-28 mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-10" />
                <div className="flex-1 h-3 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
