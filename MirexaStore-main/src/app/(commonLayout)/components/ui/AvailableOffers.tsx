"use client";

import React, { useState } from 'react';
import { HiChevronDown, HiChevronUp, HiTag } from 'react-icons/hi';

const AvailableOffers: React.FC = () => {
  const [showOffers, setShowOffers] = useState(false);

  const offers = [
    {
      discount: "₹200",
      minOrder: "₹7,000",
      condition: "Valid for NEW Business Users"
    },
    {
      discount: "₹100",
      minOrder: "₹5,000",
      condition: "Valid for NEW Business Users"
    },
    {
      discount: "₹500",
      minOrder: "₹15,000",
      condition: "Valid for NEW Business Users"
    },
    {
      discount: "₹400",
      minOrder: "₹10,000",
      condition: "Valid for Returning Users"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 mt-4">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-orange-50 rounded-lg p-2 transition-all duration-200"
        onClick={() => setShowOffers(!showOffers)}
      >
        <div className="flex items-center gap-2">
          <HiTag className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">AVAILABLE OFFERS</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-orange-600 font-semibold">View Offers</span>
          {showOffers ? (
            <HiChevronUp className="w-4 h-4 text-orange-600 transition-transform duration-200" />
          ) : (
            <HiChevronDown className="w-4 h-4 text-orange-600 transition-transform duration-200" />
          )}
        </div>
      </div>

      {showOffers && (
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
          {offers.map((offer, index) => (
            <div key={index} className="bg-white border border-orange-100 rounded-lg p-3 hover:border-orange-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Flat <span className="font-bold text-orange-600">{offer.discount}</span> off on Order above{' '}
                    <span className="font-bold text-orange-600">{offer.minOrder}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{offer.condition}</p>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableOffers;
