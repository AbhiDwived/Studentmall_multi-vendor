"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductTableSkeleton = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-center">
        <Skeleton width={260} height={32} />
      </h1>

      {/* Filter Inputs */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <Skeleton height={40} width={200} />
          <Skeleton height={40} width={150} />
          <Skeleton height={40} width={100} />
          <Skeleton height={40} width={100} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              {[
                "Name",
                "Price",
                "Category",
                "Stock Quantity",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="py-3 px-4 text-left text-sm font-semibold text-gray-600"
                >
                  <Skeleton width={80} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">
                  <Skeleton width={150} height={16} />
                  <div className="mt-1">
                    <Skeleton width={100} height={14} />
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <Skeleton width={60} height={16} />
                </td>
                <td className="py-3 px-4 text-sm">
                  <Skeleton width={100} height={16} />
                </td>
                <td className="py-3 px-4 text-sm">
                  <Skeleton width={50} height={16} />
                </td>
                <td className="py-3 px-4 text-sm">
                  <Skeleton width={80} height={16} />
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex gap-2">
                    <Skeleton width={50} height={28} />
                    <Skeleton width={60} height={28} />
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

export default ProductTableSkeleton;
