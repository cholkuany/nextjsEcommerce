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

export function ProductCardSkeleton() {
  return (
    <div className="relative size-40 lg:size-80 animate-pulse rounded-md overflow-hidden shadow">
      <div className="h-full w-full bg-gray-200 rounded-lg"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-transparent bg-opacity-60 p-2 flex items-end justify-between text-sm sm:text-xs">
        <div className="h-4 w-12 bg-gray-300 rounded"></div>
        <div className="h-6 w-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export function GallerySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
