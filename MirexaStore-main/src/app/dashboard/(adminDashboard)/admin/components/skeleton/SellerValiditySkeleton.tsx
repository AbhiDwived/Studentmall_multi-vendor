import React from "react";

const SellerValiditySkeleton = () => {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Brand",
              "Email",
              "Valid Till",
              "Time Remaining",
              "Adjust Validity (days)",
              "Action",
            ].map((title) => (
              <th
                key={title}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {skeletonRows.map((_, i) => (
            <tr key={i} className="transition-colors">
              {/* Brand */}
              <td className="px-6 py-4">
                <div className="h-4 w-32 rounded bg-gray-300 animate-pulse" />
              </td>

              {/* Email */}
              <td className="px-6 py-4">
                <div className="h-4 w-48 rounded bg-gray-300 animate-pulse" />
              </td>

              {/* Valid Till */}
              <td className="px-6 py-4">
                <div className="h-4 w-24 rounded bg-gray-300 animate-pulse" />
              </td>

              {/* Time Remaining */}
              <td className="px-6 py-4">
                <div className="h-4 w-28 rounded bg-gray-300 animate-pulse" />
              </td>

              {/* Adjust Validity */}
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="h-8 w-24 rounded-md bg-gray-300 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
                </div>
              </td>

              {/* Action Button */}
              <td className="px-6 py-4 text-center">
                <div className="h-8 w-24 mx-auto rounded-md bg-gray-300 animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerValiditySkeleton;
