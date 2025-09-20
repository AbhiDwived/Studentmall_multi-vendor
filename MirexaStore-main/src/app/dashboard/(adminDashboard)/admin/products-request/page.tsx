"use client";

import Loading from "@/app/loading";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import ProductsRequestSkeleton from "../components/skeleton/ProductsRequestSkeleton";

type Variant = {
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
};

type Product = {
  slug: any;
  totalReviews: number;
  averageRating: any;
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  category?: string;
  brand?: string;
  sellerName?: string;
  sellerEmail?: string;
  productImages?: string[];
  status: "active" | "inactive" | "draft";
  variants?: Variant[];
};

const ProductRequest = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, Product["status"]>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"all" | "inactive-draft">("all");

  const token = useSelector((state: any) => state.auth?.token);

  const fetchProducts = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const endpoint = tab === "inactive-draft" 
        ? `${process.env.NEXT_PUBLIC_API_URL}/product/inactive-draft`
        : `${process.env.NEXT_PUBLIC_API_URL}/product`;
      
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tab]);

  const handleStatusChange = (id: string, newStatus: Product["status"]) => {
    setStatusMap((prev) => ({ ...prev, [id]: newStatus }));
  };

  const updateStatus = async (id: string) => {
    const newStatus = statusMap[id];
    if (!newStatus || !token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await res.json();
      if (result.success) {
        alert(`✅ Status updated to "${newStatus}"`);
        fetchProducts();
      } else {
        alert(result.message || "❌ Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#F6550C] mb-6 text-center">
        Manage Product Status ({products.length} products)
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            tab === "all"
              ? "bg-[#F6550C] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => setTab("inactive-draft")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            tab === "inactive-draft"
              ? "bg-[#F6550C] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Inactive & Draft
        </button>
      </div>

      {loading ? (
        <ProductsRequestSkeleton></ProductsRequestSkeleton>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <p className="text-lg mb-2">No products found for "{tab}" tab.</p>
          <p className="text-sm">Try switching tabs or add some products first.</p>
          <p className="text-xs mt-2 text-gray-400">Current API endpoint: {tab === "all" ? "/product" : "/product/inactive-draft"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 border"
            >
              {/* Image */}
              <div className="w-40 h-40 bg-gray-100 rounded overflow-hidden relative">
                {product.productImages?.[0] ? (
                  <Image
                    src={product.productImages[0]}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>
              {typeof product.averageRating === "number" && (
                <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                  <span>⭐ {product.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 font-normal">
                    ({product.totalReviews ?? 0})
                  </span>
                </div>
              )}
              {/* Info */}
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600">
                {product.description || "No description"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-800">Brand:</span>{" "}
                {product.brand || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-800">Category:</span>{" "}
                {product.category || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-800">Price:</span>{" "}
                <span className="text-[#F6550C] font-semibold">
                  ₹{product.discountPrice || product.price}
                </span>{" "}
                {product.discountPrice && (
                  <span className="line-through ml-2 text-gray-400">
                    ₹{product.price}
                  </span>
                )}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-800">Stock:</span>{" "}
                {product.stockQuantity}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-800">Seller:</span>{" "}
                {product.sellerName} ({product.sellerEmail})
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-800">Status:</span>{" "}
                <span className="capitalize text-[#F6550C]">
                  {product.status}
                </span>
              </p>

              {/* Action */}
              <div className="flex items-center gap-3 mt-2">
                <select
                  value={statusMap[product._id] || product.status}
                  onChange={(e) =>
                    handleStatusChange(
                      product._id,
                      e.target.value as Product["status"]
                    )
                  }
                  className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F6550C]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>

                <button
                  onClick={() => updateStatus(product._id)}
                  className="bg-[#F6550C] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition"
                >
                  Update
                </button>
                <Link
                  href={`/product/${product.slug}`}
                  className="ml-auto text-[#F6550C] font-semibold text-sm hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRequest;
