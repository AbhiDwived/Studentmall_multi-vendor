"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const InvoiceSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton width={120} height={32} />
        <Skeleton width={140} height={36} />
      </div>

      <div className="bg-white p-8 shadow-xl rounded-md border border-gray-200">
        {/* Company Info and Invoice Summary */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Skeleton width={120} height={24} />
            <Skeleton width={180} height={16} />
            <Skeleton width={160} height={16} />
          </div>
          <div className="text-right space-y-2">
            <Skeleton width={160} height={16} />
            <Skeleton width={140} height={16} />
            <Skeleton width={120} height={16} />
          </div>
        </div>

        {/* Shipping and Payment Summary */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div className="space-y-2">
            <Skeleton width={100} height={20} />
            <Skeleton width={160} height={16} />
            <Skeleton width={180} height={16} />
            <Skeleton width={150} height={16} />
            <Skeleton width={200} height={16} />
          </div>
          <div className="space-y-2 text-right md:text-left">
            <Skeleton width={140} height={20} />
            <Skeleton width={100} height={16} />
            <Skeleton width={100} height={16} />
            <Skeleton width={120} height={22} />
          </div>
        </div>

        {/* Table Header */}
        <Skeleton width={160} height={20} className="mb-3" />
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {["Image", "Product", "Price", "Qty", "Total"].map((head) => (
                <th key={head} className="p-2 border">
                  <Skeleton width={60} height={16} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 border">
                  <Skeleton width={50} height={50} />
                </td>
                <td className="p-2 border">
                  <Skeleton width={150} height={16} />
                </td>
                <td className="p-2 border">
                  <Skeleton width={60} height={16} />
                </td>
                <td className="p-2 border">
                  <Skeleton width={30} height={16} />
                </td>
                <td className="p-2 border">
                  <Skeleton width={70} height={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delivery Note */}
        <div className="mt-6">
          <Skeleton width={120} height={20} />
          <Skeleton count={2} height={16} width="100%" />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSkeleton;
