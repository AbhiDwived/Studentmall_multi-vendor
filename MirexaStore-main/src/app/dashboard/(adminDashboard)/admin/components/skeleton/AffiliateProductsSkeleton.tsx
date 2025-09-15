import React from "react";

const AffiliateProductsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="h-10 w-72 bg-gray-300 rounded-md animate-pulse mb-2"></div>
        <div className="h-5 w-48 bg-gray-300 rounded-md animate-pulse mb-4"></div>
        <div className="h-10 w-full sm:w-96 bg-gray-300 rounded-md animate-pulse"></div>
      </div>

      {/* Repeat skeleton blocks for sellers */}
      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="mb-10 border rounded-lg shadow p-4 bg-white"
          aria-hidden="true"
        >
          <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="h-8 w-60 bg-gray-300 rounded-md animate-pulse mb-2 md:mb-0"></div>
            <div className="h-5 w-32 bg-gray-300 rounded-md animate-pulse"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {["Image", "Name", "Category", "Price", "Type", "Action"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-400 whitespace-nowrap"
                      >
                        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((_, row) => (
                  <tr key={row} className="border-t hover:bg-gray-50">
                    {/* Image cell */}
                    <td className="px-3 sm:px-4 py-2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                    {/* Name */}
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                    {/* Category */}
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                    {/* Price */}
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                    {/* Type */}
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                    {/* Action */}
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      <div className="h-7 w-20 bg-gray-300 rounded-md animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AffiliateProductsSkeleton;
