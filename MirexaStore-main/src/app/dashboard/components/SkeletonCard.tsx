import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCard: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <div className="flex items-center mb-3 gap-3">
      <Skeleton circle={true} style={{ width: 32, height: 32 }} />
      <Skeleton style={{ width: 120, height: 24 }} />
    </div>
    <Skeleton style={{ width: 80, height: 32 }} />
  </div>
);

export default SkeletonCard;
