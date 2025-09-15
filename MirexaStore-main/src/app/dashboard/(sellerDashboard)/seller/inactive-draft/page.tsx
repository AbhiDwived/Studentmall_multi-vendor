"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import WithAuth from "@/app/lib/utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import Link from "next/link";
import { Star } from "lucide-react";
import InactiveProductSkeleton from "../components/skeletons/InactiveProductSkeleton";

const InactiveDraftProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: any) => state.auth?.token);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/inactive-draft`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allProducts = response?.data?.data;
        const sellerProducts = allProducts?.filter(
          (product: any) => product.sellerEmail === user?.email
        );

        setProducts(sellerProducts);
        setFilteredProducts(sellerProducts);
      } catch (error) {
        toast.error("Error fetching inactive/draft products!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email && token) {
      fetchProducts();
    }
  }, [user, token]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.status === filter));
    }
  }, [filter, products]);

  if (loading) {
    return <InactiveProductSkeleton></InactiveProductSkeleton>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Inactive & Draft Products
      </h1>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Under Review</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-600">Product</th>
              <th className="px-6 py-4 font-medium text-gray-600">Price</th>
              <th className="px-6 py-4 font-medium text-gray-600">Category</th>
              <th className="px-6 py-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No products found for this filter.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800">
                    <Link
                      href={`/product/${product.slug}`}
                      className="hover:underline font-medium"
                    >
                      {product.name}
                    </Link>
                    {typeof product.averageRating === "number" && (
                      <div className="flex items-center gap-1 mt-1 text-yellow-500 text-xs font-medium">
                        <Star className="w-4 h-4" />
                        <span>{product.averageRating.toFixed(1)}</span>
                        <span className="text-gray-400">
                          ({product.totalReviews ?? 0})
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    ৳{product.price}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {product.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
						${
              product.status === "inactive"
                ? "bg-red-100 text-red-700"
                : product.status === "draft"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
                    >
                      {product.status === "draft"
                        ? "Under Review"
                        : product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <InactiveDraftProductPage />
    </WithAuth>
  );
}
