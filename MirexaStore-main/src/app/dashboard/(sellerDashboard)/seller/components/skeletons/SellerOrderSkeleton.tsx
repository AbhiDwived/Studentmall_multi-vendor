"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerOrderSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900">
        <Skeleton width={260} height={36} />
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <Skeleton height={40} width={240} />
        <Skeleton height={40} width={180} />
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Date",
                "Total",
                "Status",
                "Payment Method",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {/* Order ID */}
                <td className="py-3 px-4">
                  <Skeleton width={80} />
                </td>

                {/* Customer */}
                <td className="py-3 px-4">
                  <Skeleton width={120} />
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-center">
                  <Skeleton width={80} />
                </td>

                {/* Total */}
                <td className="py-3 px-4 text-center">
                  <Skeleton width={60} />
                </td>

                {/* Status */}
                <td className="py-3 px-4 text-center">
                  <Skeleton width={90} height={24} borderRadius={999} />
                </td>

                {/* Payment Method */}
                <td className="py-3 px-4 text-center">
                  <Skeleton width={100} />
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Skeleton width={60} height={28} />
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

export default SellerOrderSkeleton;
