import React from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="animate-pulse px-4 sm:px-8 lg:px-16 py-6">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image section */}
        <div className="w-full md:w-1/2">
          <div className="w-full h-80 bg-gray-200 rounded-md mb-4"></div>
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-300 rounded-md"></div>
            ))}
          </div>
        </div>

        {/* Details section */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>

          <div className="space-y-2 pt-4">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="pt-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gray-300 rounded-full"
                ></div>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="px-6 py-2 bg-gray-200 rounded-lg w-fit"
                ></div>
              ))}
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <div className="h-10 bg-gray-300 rounded w-full"></div>
            <div className="h-10 bg-gray-400 rounded w-full"></div>
          </div>
        </div>
      </div>

      {/* Seller profile */}
      <div className="mt-10 h-24 bg-gray-200 rounded-md"></div>

      {/* Additional Info */}
      <div className="mt-10 space-y-6">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
          ))}
        </div>

        <div className="h-6 bg-gray-300 rounded w-1/4 mt-6"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Review section */}
      <div className="mt-12">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-md p-4 mb-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
