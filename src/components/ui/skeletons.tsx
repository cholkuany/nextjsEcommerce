export function ProductDetailsSkeleton() {
  return (
    <section className="max-w-7xl min-h-screen mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
      {/* Left: Image Placeholder */}
      <div className="w-full h-[500px] bg-gray-300 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer" />
      </div>

      {/* Right: Info Placeholder */}
      <div className="flex flex-col gap-4">
        <div className="h-10 bg-gray-300 rounded w-3/4" />
        <div className="h-8 bg-gray-300 rounded w-1/3" />
        <div className="h-24 bg-gray-200 rounded w-full" />
        <div className="h-12 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 w-32 bg-gray-300 rounded mt-4" />
      </div>
    </section>
  );
}
