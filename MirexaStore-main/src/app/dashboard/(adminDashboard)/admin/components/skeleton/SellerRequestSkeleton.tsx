import React from "react";

const SellerRequestSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="h-6 w-48 bg-gray-300 rounded mb-6 animate-pulse" />

      <div className="mb-6">
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="space-y-4">
        {skeletonItems.map((_, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg shadow-sm animate-pulse space-y-3"
          >
            {/* Title */}
            <div className="h-5 w-40 bg-gray-300 rounded" />

            {/* Phone */}
            <div className="h-4 w-32 bg-gray-200 rounded" />

            {/* Additional Info */}
            <div className="h-4 w-3/4 bg-gray-200 rounded" />

            {/* User */}
            <div className="h-4 w-2/3 bg-gray-200 rounded" />

            {/* Status badge */}
            <div className="mt-2">
              <div className="h-6 w-24 bg-gray-300 rounded-full" />
            </div>

            {/* Buttons */}
            <div className="mt-4 flex space-x-4">
              <div className="h-10 w-24 bg-gray-300 rounded-lg" />
              <div className="h-10 w-24 bg-gray-300 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerRequestSkeleton;
