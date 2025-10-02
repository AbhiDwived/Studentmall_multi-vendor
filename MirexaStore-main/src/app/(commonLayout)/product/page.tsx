"use client";

import { useState, useEffect } from "react";
import ProductCart from "../components/ui/ProductCart";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        if (response.ok) {
          const responseData = await response.json();
          setProducts(responseData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Filter for featured products
  const featuredProducts = products.filter(
    (product: { status: string; isFeatured: any }) =>
      product.isFeatured && product.status === "active"
  );
  // Filter for new arrival products
  const newArrivalProducts = products.filter(
    (product: { status: string; isNewArrival: any }) =>
      product.isNewArrival && product.status === "active"
  );

  return (
    <div>
      {/* New Arrivals Section */}
      <section>
        <h2 className="text-3xl pt-2 sm:pt-7 font-semibold text-center mb-2 sm:mb-8 text-gray-800">
          New Arrivals
        </h2>
        <ProductCart products={newArrivalProducts} />
      </section>

      {/* Featured Products Section */}
      <section className="mt-2 sm:mt-8">
        <h2 className="text-3xl font-semibold text-center mb-2 sm:mb-8 text-gray-800">
          Featured Products
        </h2>
        <ProductCart products={featuredProducts} />
      </section>

      {/* All Products Section */}
      <section className="mt-2 sm:mt-8">
        <h2 className="text-3xl font-semibold text-center mb-2 sm:mb-8 text-gray-800">
          All Products
        </h2>
        <ProductCart products={products} />
      </section>
    </div>
  );
};

export default Product;
