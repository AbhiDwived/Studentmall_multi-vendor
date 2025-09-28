"use client";

import React from 'react';
import { HiShieldCheck, HiStar, HiLockClosed, HiCheckCircle, HiTruck } from 'react-icons/hi';

// Ensure JSX elements are properly typed
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    }
  }
}

const TrustIndicators: React.FC = () => {
  const indicators = [
    {
      icon: <HiShieldCheck className="w-6 h-6" />,
      title: "Warranty",
      subtitle: "Warranty as per brand",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <HiCheckCircle className="w-6 h-6" />,
      title: "Original Products",
      subtitle: "100% Original Products",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <HiLockClosed className="w-6 h-6" />,
      title: "Secure Payments",
      subtitle: "Secure payments",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <HiShieldCheck className="w-6 h-6" />,
      title: "Buyer Protection",
      subtitle: "100% Buyer protection",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <HiStar className="w-6 h-6" />,
      title: "Top Brands",
      subtitle: "Top Brands",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 my-6 shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {indicators.map((indicator, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-r ${indicator.color} flex-shrink-0`}>
              {indicator.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-800 mb-0.5 leading-tight">{indicator.title}</h4>
              <p className="text-xs text-gray-600 leading-tight">{indicator.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustIndicators;