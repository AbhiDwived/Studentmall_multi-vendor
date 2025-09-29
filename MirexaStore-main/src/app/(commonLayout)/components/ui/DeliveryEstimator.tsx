"use client";

import React, { useState } from 'react';
import { HiLocationMarker, HiTruck } from 'react-icons/hi';

const DeliveryEstimator: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<{
    available: boolean;
    days: number;
    charges: number;
  } | null>(null);

  const checkDelivery = () => {
    if (!pincode || pincode.length !== 6) return;
    
    // Mock delivery estimation logic
    const mockDelivery = {
      available: true,
      days: Math.floor(Math.random() * 5) + 2, // 2-7 days
      charges: pincode.startsWith('1') ? 0 : 50 // Free for metro cities
    };
    
    setDeliveryInfo(mockDelivery);
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <HiTruck className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-800">Delivery Information</h4>
      </div>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter pincode"
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={checkDelivery}
          disabled={pincode.length !== 6}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check
        </button>
      </div>
      
      {deliveryInfo && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-green-600">
            <span>✓ Delivery available</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated delivery:</span>
            <span className="font-medium">{deliveryInfo.days} days</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery charges:</span>
            <span className="font-medium">
              {deliveryInfo.charges === 0 ? 'FREE' : `₹${deliveryInfo.charges}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryEstimator;
