"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EditProductSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        <Skeleton width={300} height={48} />
      </h1>

      {/* Error placeholder (hidden) */}
      <div className="mb-4 text-center">
        {/* Leave empty or add a small skeleton for error */}
        <Skeleton width={200} height={20} />
      </div>

      <form className="space-y-10">
        {/* Basic Info Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(18)
            .fill(null)
            .map((_, i) => (
              <div key={i}>
                <Skeleton width={100} height={18} className="mb-2" />
                <Skeleton height={38} />
              </div>
            ))}

          {/* Description textarea */}
          <div className="md:col-span-2">
            <Skeleton width={120} height={18} className="mb-2" />
            <Skeleton height={72} />
          </div>

          {/* Slug textarea */}
          <div className="md:col-span-2">
            <Skeleton width={120} height={18} className="mb-2" />
            <Skeleton height={72} />
          </div>

          {/* Long Description textarea */}
          <div className="md:col-span-2">
            <Skeleton width={140} height={18} className="mb-2" />
            <Skeleton height={96} />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-6">
          <div>
            <Skeleton width={100} height={24} />
          </div>
          <div>
            <Skeleton width={120} height={24} />
          </div>
        </div>

        {/* Variants Section */}
        <div className="space-y-6 mt-8">
          <Skeleton width={200} height={28} className="mb-4" />

          {[1, 2].map((variant) => (
            <div
              key={variant}
              className="border rounded-lg p-4 bg-gray-50"
              aria-hidden="true"
            >
              <Skeleton width={120} height={20} className="mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(6)
                  .fill(null)
                  .map((_, idx) => (
                    <Skeleton key={idx} height={38} />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-8">
          <Skeleton width={160} height={40} />
        </div>
      </form>
    </div>
  );
};

export default EditProductSkeleton;
