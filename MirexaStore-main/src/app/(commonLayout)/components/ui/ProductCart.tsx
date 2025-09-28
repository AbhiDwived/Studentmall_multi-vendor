"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Loading from "@/app/loading";
import { Pagination } from "@heroui/react";
import { Star } from "lucide-react";
import ProductCardSkeleton from "../skeleton/ProductCardSkeleton";

// Enhanced Product Type with all new backend model fields
export interface Specification {
  key: string;
  value: string;
}

export interface ProductVariant {
  color?: string;
  size?: string;
  sku?: string;
  price?: number;
  stock?: number;
  images?: string[];
  weight?: number;
  innerSlug?: string;
  innerSubSlug?: string;
  basePrice?: number;
  discount?: number;
  finalPrice?: number;
  defaultDescription?: string;
  variantDescription?: string;
  specifications?: Specification[];
}

export interface Slug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SubSlug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentSlug: string;
}

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  stock: number;
  category: string;
  longDescription?: string;
  materials?: string;
  careInstructions?: string;
  specifications?: Specification[];
  additionalInfo?: string;

  // Essential E-commerce Fields
  sku?: string;
  metaTitle?: string;
  metaDescription?: string;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  viewCount?: number;
  wishlistCount?: number;
  relatedProducts?: string[];
  freeShipping?: boolean;
  returnPolicy?: string;

  // Advanced Features
  innerSlug?: string;
  innerSubSlug?: string;
  defaultDescription?: string;
  variantDescription?: string;
  addedBy?: string;

  // Slug System
  slug: string | Slug;
  subSlug?: SubSlug;
  urlSlug?: string;
  
  // Product Settings
  type?: 'own' | 'affiliate';
  affiliateLink?: string;
  discountPrice?: number;
  brand?: string;
  tags?: string[];

  // Variants
  variants?: ProductVariant[];

  // Images and Media
  productImages: string[];
  videoUrl?: string;

  // Reviews and Ratings
  rating?: number;
  totalReviews?: number;
  averageRating?: number;

  // Status
  status?: 'active' | 'inactive' | 'draft';
  isFeatured?: boolean;
  isNewArrival?: boolean;

  // Seller Info
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerNumber?: number;

  // Additional Details
  features?: string[];
  notes?: string;
  weight?: number;
  dimensions?: string;
  warranty?: string;

  // System Fields
  createdAt?: string;
  updatedAt?: string;
};

type ProductCartProps = {
  products: Product[];
};

const ProductCart = ({ products }: ProductCartProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [loading, setLoading] = useState(true);

  const currentProducts = products;

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleSeeDetails = (product: Product) => {
    setLoading(true);
    // Use urlSlug if available, otherwise generate from name
    const generateSlug = (name: string) => name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const finalSlug = (product as any).urlSlug || generateSlug(product.name);
    router.push(`/product/${finalSlug}`);
  };

  const calculateDiscountPercentage = (
    price: number,
    discountPrice: number
  ) => {
    if (discountPrice && price > discountPrice) {
      return Math.round(((price - discountPrice) / price) * 100);
    }
    return 0;
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6 min-h-screen">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <main className="container mx-auto px-2 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const discountPercentage = calculateDiscountPercentage(
                  product.price,
                  product.discountPrice || 0
                );

                return (
                  <motion.div
                    key={product._id}
                    className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleSeeDetails(product)}
                  >
                    {/* Image Area */}
                    <div className="relative w-full h-44 bg-white flex items-center justify-center">
                      {discountPercentage > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md z-10">
                          {discountPercentage}% OFF
                        </span>
                      )}

                      {product.productImages?.length > 0 ? (
                        <div className="relative w-[180px] h-[200px]">
                          <Image
                            src={product.productImages[0]}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xl">No Image</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-1">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>

                      {product.brand && (
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      )}

                      <p className="text-xs text-gray-400">
                        {product.category}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-orange-600 font-bold">
                              ₹{product.discountPrice}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-800 font-semibold">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={
                              i < (product.averageRating || 0)
                                ? "#facc15"
                                : "none"
                            }
                            strokeWidth={1.5}
                          />
                        ))}
                        <span className="ml-1 text-gray-500 text-xs">
                          ({product.totalReviews || 0})
                        </span>
                      </div>

                      {/* Stock Status */}
                      <span
                        className={`text-xs font-semibold ${
                          product.stockQuantity > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {product.stockQuantity > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>


        </main>
      )}
    </>
  );
};

export default ProductCart;
