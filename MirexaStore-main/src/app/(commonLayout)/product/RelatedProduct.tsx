"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

// Type Definitions
export type Product = {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand?: string;
  productImages: string[];
  slug: string;
};

type RelatedProductProps = {
  relatedProducts: Product[];
};

const RelatedProduct = ({ relatedProducts }: RelatedProductProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 4; // Show 4 products per page
  const router = useRouter();

  // Pagination logic
  const totalPages: number = Math.ceil(
    relatedProducts.length / productsPerPage
  );

  const displayedProducts: Product[] = useMemo(
    () =>
      relatedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [relatedProducts, currentPage]
  );

  // Navigate to product details page
  const handleSeeDetails = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl pb-10 font-semibold">Related Products</h1>

      {/* Related Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <motion.div
              key={product._id}
              className="card bg-base-100 shadow-md rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleSeeDetails(product.slug)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Product Image */}
              <figure className="h-40 flex items-center justify-center overflow-hidden bg-white">
                {product.productImages?.length > 0 ? (
                  <Image
                    src={product.productImages[0]}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-contain p-2 max-h-[150px] max-w-[150px]"
                    unoptimized
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">
                    {product.name[0]}
                  </span>
                )}
              </figure>

              {/* Product Details */}
              <div className="card-body p-2 lg:p-4 flex flex-col items-center gap-1">
                <h2 className="card-title text-sm lg:text-base font-medium text-center">
                  {product.name}
                </h2>

                {/* Brand (optional) */}
                {product.brand && (
                  <p className="text-gray-500 text-xs">{product.brand}</p>
                )}

                {/* Category */}
                <p className="text-gray-500 text-xs">{product.category}</p>

                {/* Price */}
                <div className="flex items-center gap-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-[#F85606] font-bold">
                        ৳{product.discountPrice}
                      </span>
                      <span className="line-through text-gray-400 text-xs">
                        ৳{product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#F85606] font-bold">
                      ৳{product.price}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-xl text-gray-600 text-center py-8 px-4">
            No similar items available right now. Please check back later!
          </p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {/* Previous Button */}
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          {/* First Page and Ellipsis */}
          {currentPage > 3 && (
            <>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <span className="btn btn-sm btn-outline">...</span>
            </>
          )}

          {/* Dynamic Page Numbers */}
          {Array.from(
            { length: Math.min(3, totalPages) },
            (_, index) => currentPage - 1 + index
          )
            .filter((page) => page > 0 && page <= totalPages)
            .map((page) => (
              <button
                key={page}
                className={`btn btn-sm ${
                  currentPage === page ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

          {/* Ellipsis and Last Page */}
          {currentPage < totalPages - 2 && (
            <>
              <span className="btn btn-sm btn-outline">...</span>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default RelatedProduct;
