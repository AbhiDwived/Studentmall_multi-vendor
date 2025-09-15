"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const InactiveProductSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Title */}
      <div className="mb-6">
        <Skeleton style={{ height: 40, width: 300 }} />
      </div>

      {/* Filter Dropdown Skeleton */}
      <div className="mb-6 flex justify-end">
        <Skeleton style={{ height: 36, width: 160 }} />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Product", "Price", "Category", "Status"].map((title) => (
                <th key={title} className="px-6 py-4 font-medium text-gray-600">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <Skeleton width={200} height={16} />
                  <div className="mt-2 flex gap-2 items-center">
                    <Skeleton circle width={16} height={16} />
                    <Skeleton width={50} height={12} />
                    <Skeleton width={30} height={12} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton width={50} height={16} />
                </td>
                <td className="px-6 py-4">
                  <Skeleton width={80} height={16} />
                </td>
                <td className="px-6 py-4">
                  <Skeleton width={90} height={24} borderRadius={999} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InactiveProductSkeleton;
