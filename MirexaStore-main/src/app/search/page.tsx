"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "../(commonLayout)/components/shared/Navbar";
import ProductCart from "../(commonLayout)/components/ui/ProductCart";
import { Variant } from "framer-motion";
import Loading from "../loading";

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
  category: string;
  stock: number;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        const filtered = res.data.data.filter((product: Product) =>
          product.name.toLowerCase().includes(query?.toLowerCase() || "")
        );
        setProducts(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [query]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const displayedProducts = useMemo(
    () =>
      products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [products, currentPage]
  );

  return (
    <section>
      <Navbar />
      {/* Search Query Show */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        {query && (
          <h2 className="text-xl font-semibold text-gray-700">
            Search results for &quot;
            <span className="text-[#F85606]">{query}</span>&quot;
          </h2>
        )}
      </div>

      {/* Loading or ProductCart */}
      {loading ? <Loading /> : <ProductCart products={displayedProducts} />}
    </section>
  );
};

export default SearchPage;
