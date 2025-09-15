"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubscriptionSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <Skeleton height={48} width={300} className="mx-auto mb-10" />

      {/* Subscription Status Card */}
      <div className="text-center mb-10">
        <div className="inline-block px-8 py-5 rounded-2xl border bg-white shadow-sm w-full max-w-md">
          <div className="space-y-2">
            <Skeleton width={160} height={20} className="mx-auto" />
            <Skeleton width={120} height={24} className="mx-auto" />
            <Skeleton width={100} height={16} className="mx-auto" />
          </div>
        </div>
      </div>

      {/* Plan Title */}
      <Skeleton height={40} width={300} className="mx-auto mb-10" />

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border bg-white shadow-sm space-y-4"
            >
              <Skeleton width={80} height={20} />
              <Skeleton height={24} width={160} />
              <Skeleton count={2} height={14} />
              <Skeleton count={3} height={12} />
              <Skeleton width={160} height={16} />
              <Skeleton width={100} height={24} />
              <Skeleton height={40} />
            </div>
          ))}
      </div>

      {/* Selected Plan Form */}
      <div className="mt-12 max-w-2xl mx-auto bg-white border rounded-2xl p-6 shadow space-y-6">
        <Skeleton width={240} height={24} />
        <Skeleton count={4} height={12} />

        <div className="space-y-5">
          <div>
            <Skeleton width={180} height={14} className="mb-2" />
            <Skeleton height={40} />
          </div>

          <div>
            <Skeleton width={160} height={14} className="mb-2" />
            <Skeleton height={40} />
            <Skeleton width={200} height={12} className="mt-1" />
          </div>

          <Skeleton height={48} />
        </div>
      </div>

      {/* Subscription Requests */}
      <div className="mt-20 mb-12">
        <Skeleton width={240} height={36} className="mx-auto mb-6" />

        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="space-y-2 w-full md:w-auto">
                <Skeleton width={160} height={18} />
                <Skeleton width={220} height={14} />
                <Skeleton width={200} height={14} />
              </div>
              <Skeleton width={100} height={28} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
