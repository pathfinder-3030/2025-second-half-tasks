export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        ポケモン図鑑
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="flex gap-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
