"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Loading from "@/app/loading";
import ProductCart from "@/app/(commonLayout)/components/ui/ProductCart";

export interface Variant {
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  productImages: string[];
  variants: Variant[];
  brand: string;
  stockQuantity: number;
  rating: number;
  category: string; // Ensure this is included here
  stock: number; // Ensure this is included here
}

const CategoryProductsPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Number of products to display per page

  useEffect(() => {
    if (categorySlug) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/product/category/${categorySlug}`)
        .then((res) => {
          if (Array.isArray(res.data.data)) {
            setProducts(res.data.data);
          } else {
            console.error("Expected array, got: ", res.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching products: ", err);
          setLoading(false);
        });
    }
  }, [categorySlug]);

  if (loading || !categorySlug) {
    return (
      <div className="text-center py-10">
        <Loading></Loading>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center py-10">No products found in this category.</p>
    );
  }

  return (
    <div>
      {/* Pass products data as props to ProductCart */}
      <ProductCart products={products} />
    </div>
  );
};

export default CategoryProductsPage;
