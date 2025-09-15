const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-56 bg-gray-200 flex items-center justify-center">
        <div className="w-[180px] h-[200px] bg-gray-300 rounded"></div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>

        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
          <div className="h-3 w-10 bg-gray-200 rounded line-through"></div>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
          ))}
          <div className="w-6 h-3 bg-gray-200 rounded ml-2"></div>
        </div>

        <div className="h-3 w-1/3 bg-gray-300 rounded mt-1"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
