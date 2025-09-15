import React from "react";

const ProductsRequestSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto" aria-hidden="true">
      {/* Title */}
      <div className="h-10 w-60 bg-gray-300 rounded-md animate-pulse mb-6 mx-auto"></div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="h-9 w-32 bg-gray-300 rounded-md animate-pulse"
          ></div>
        ))}
      </div>

      {/* Product cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 border"
          >
            {/* Image placeholder */}
            <div className="w-40 h-40 bg-gray-300 rounded animate-pulse" />

            {/* Rating placeholder */}
            <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />

            {/* Name */}
            <div className="h-6 w-48 bg-gray-300 rounded animate-pulse" />

            {/* Description */}
            <div className="h-4 w-full max-w-xs bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-52 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />

            {/* Action controls */}
            <div className="flex items-center gap-3 mt-2">
              {/* Select box */}
              <div className="h-9 w-28 bg-gray-300 rounded-md animate-pulse" />
              {/* Button */}
              <div className="h-9 w-20 bg-gray-300 rounded-md animate-pulse" />
              {/* Link */}
              <div className="h-5 w-24 bg-gray-300 rounded animate-pulse ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsRequestSkeleton;
