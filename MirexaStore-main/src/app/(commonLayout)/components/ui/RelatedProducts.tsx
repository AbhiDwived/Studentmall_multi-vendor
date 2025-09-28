"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiStar } from 'react-icons/hi';

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  productImages: string[];
  category?: string;
  brand?: string;
  averageRating?: number;
  totalReviews?: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <HiStar
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
      />
    ));
  };

  return (
    <div className="mt-8 bg-white p-6 border border-gray-200 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">🔗 Related Products</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product) => (
          <Link
            key={product._id}
            href={`/product/${(product as any).urlSlug || product._id}`}
            className="group block bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-32 mb-3">
              <Image
                src={product.productImages[0]}
                alt={product.name}
                fill
                className="object-contain rounded group-hover:scale-105 transition-transform"
                unoptimized={true}
              />
            </div>
            
            <h4 className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600 mb-1">
              {product.name}
            </h4>
            
            <div className="flex items-center gap-1 mb-2">
              {product.averageRating && (
                <>
                  <div className="flex">{renderStars(product.averageRating)}</div>
                  <span className="text-xs text-gray-500">({product.totalReviews || 0})</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-orange-600">
                ₹{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;