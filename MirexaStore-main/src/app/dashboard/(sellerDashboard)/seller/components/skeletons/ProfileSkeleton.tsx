"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        <Skeleton width={200} height={48} />
      </h1>

      {/* Brand Profile Skeleton */}
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 hover:shadow-2xl transition duration-300">
        {/* Banner */}
        <div className="w-full rounded-xl overflow-hidden shadow">
          <Skeleton width="100%" height={240} />
        </div>

        {/* Brand Logo + Name + Tagline + Location */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton circle width={112} height={112} />
          <div className="space-y-2">
            <Skeleton width={160} height={24} />
            <Skeleton width={120} height={16} />
          </div>
          <Skeleton width={100} height={16} />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton width={80} height={16} />
                <Skeleton width="100%" height={20} />
              </div>
            ))}
        </div>

        {/* About the Brand */}
        <div>
          <Skeleton width={160} height={20} className="mb-2" />
          <Skeleton count={3} />
        </div>

        {/* Social Links */}
        <div className="flex gap-4 mt-4">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} width={80} height={28} />
            ))}
        </div>

        {/* Edit Button */}
        <div className="mt-6">
          <Skeleton width="100%" height={48} />
        </div>
      </div>

      {/* OR userProfile skeleton */}
      <div className="bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition duration-300 mt-10">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <Skeleton circle width={96} height={96} />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width={100} height={16} />
                  <Skeleton width="100%" height={20} />
                </div>
              ))}
          </div>
        </div>

        {/* Edit Button */}
        <Skeleton width="100%" height={48} />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
