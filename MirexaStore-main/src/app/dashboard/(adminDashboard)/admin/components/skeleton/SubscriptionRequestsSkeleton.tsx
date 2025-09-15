import React from "react";

const SubscriptionRequestsSkeleton = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto" aria-hidden="true">
      {/* Title */}
      <div className="h-10 w-72 bg-gray-300 rounded-md animate-pulse mb-6"></div>

      {/* Refresh button */}
      <div className="h-10 w-28 bg-gray-300 rounded-md animate-pulse mb-4"></div>

      {/* Requests list */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
              {/* Left info block */}
              <div className="space-y-2 max-w-xl w-full">
                <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>{" "}
                {/* planTitle & price */}
                <div className="h-4 w-64 bg-gray-300 rounded animate-pulse"></div>{" "}
                {/* Seller */}
                <div className="h-4 w-72 bg-gray-300 rounded animate-pulse"></div>{" "}
                {/* Payment */}
                <div className="h-3 w-40 bg-gray-300 rounded animate-pulse mt-1"></div>{" "}
                {/* Requested on */}
              </div>

              {/* Buttons block */}
              <div className="flex gap-2 shrink-0">
                <div className="h-8 w-20 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionRequestsSkeleton;
