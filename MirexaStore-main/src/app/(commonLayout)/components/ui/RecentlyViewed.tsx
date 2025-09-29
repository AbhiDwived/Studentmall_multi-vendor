"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiEye } from 'react-icons/hi';
import axios from 'axios';

interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  viewedAt: string;
  urlSlug?: string;
}

const RecentlyViewed: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const validateAndLoadProducts = async () => {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const validProducts: RecentProduct[] = [];
      
      for (const product of viewed.slice(0, 6)) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`);
          if (response.data.success && response.data.data.status === 'active' && !response.data.data.isDeleted) {
            validProducts.push({
              ...product,
              urlSlug: response.data.data.urlSlug
            });
          }
        } catch (error) {
          // Product not found or deleted, skip it
          console.log(`Product ${product._id} no longer available`);
        }
      }
      
      setRecentProducts(validProducts);
      
      // Update localStorage with only valid products
      if (validProducts.length !== viewed.length) {
        localStorage.setItem('recentlyViewed', JSON.stringify(validProducts));
      }
    };
    
    validateAndLoadProducts();
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-8 bg-white p-6 border border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <HiEye className="w-5 h-5 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-800">Recently Viewed</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recentProducts.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.urlSlug || product._id}`}
            className="group block"
          >
            <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="relative w-full h-24 mb-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain rounded"
                  unoptimized={true}
                />
              </div>
              <h4 className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600">
                {product.name}
              </h4>
              <p className="text-sm text-orange-600 font-semibold">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
