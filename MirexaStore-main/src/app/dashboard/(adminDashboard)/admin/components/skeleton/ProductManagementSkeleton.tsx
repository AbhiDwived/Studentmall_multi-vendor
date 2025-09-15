import React from "react";

const ProductManagementSkeleton = () => {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="container mx-auto p-6 animate-pulse">
      {/* Title */}
      <div className="h-8 w-64 bg-gray-300 rounded mb-6 mx-auto" />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <div className="h-10 w-full sm:w-48 bg-gray-200 rounded-md" />
          <div className="h-10 w-full sm:w-36 bg-gray-200 rounded-md" />
          <div className="h-10 w-full sm:w-28 bg-gray-200 rounded-md" />
          <div className="h-10 w-full sm:w-28 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              {["Name", "Price", "Category", "Stock Quantity", "Actions"].map(
                (title) => (
                  <th
                    key={title}
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-600"
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((_, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-300 rounded-md" />
                    <div className="h-8 w-16 bg-gray-300 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagementSkeleton;
