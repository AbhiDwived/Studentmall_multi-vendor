"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAppSelector } from "@/app/lib/redux/hook";
import Loading from "@/app/loading";
import AffiliateProductsSkeleton from "../components/skeleton/AffiliateProductsSkeleton";

type GroupedProducts = {
  [sellerEmail: string]: {
    sellerName: string;
    products: Product[];
  };
};

export type Product = {
  type: ReactNode;
  sellerEmail: any;
  sellerName: string;
  affiliateLink: string | undefined;
  stockQuantity: number;
  stock: number;
  _id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  brand?: string;
  productImages: string[];
  slug: string;
  averageRating?: number;
  totalReviews?: number;
};

const AffiliateProductsPage = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [groupedData, setGroupedData] = useState<GroupedProducts>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAffiliateProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/affiliate-products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const products: Product[] = response.data.data;
        const grouped: GroupedProducts = {};

        products.forEach((product) => {
          const email = product.sellerEmail;
          if (!grouped[email]) {
            grouped[email] = {
              sellerName: product.sellerName || "Unknown Seller",
              products: [],
            };
          }
          grouped[email].products.push(product);
        });

        setGroupedData(grouped);
      } catch (err) {
        console.error("Failed to fetch affiliate products", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAffiliateProducts();
  }, [token]);

  const filteredGroupedData = useMemo(() => {
    if (!search.trim()) return groupedData;

    const lowerSearch = search.toLowerCase();
    const filtered: GroupedProducts = {};

    Object.entries(groupedData).forEach(([email, { sellerName, products }]) => {
      const matchedProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerSearch) ||
          email.toLowerCase().includes(lowerSearch)
      );

      if (matchedProducts.length > 0) {
        filtered[email] = {
          sellerName,
          products: matchedProducts,
        };
      }
    });

    return filtered;
  }, [search, groupedData]);

  if (loading) return <AffiliateProductsSkeleton></AffiliateProductsSkeleton>;

  const sellerCount = Object.keys(filteredGroupedData).length;
  const totalProducts = Object.values(filteredGroupedData).reduce(
    (acc, group) => acc + group.products.length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
          🛒 Affiliate Products Overview
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          👥 <strong>{sellerCount}</strong> sellers | 📦{" "}
          <strong>{totalProducts}</strong> affiliate products
        </p>
        <input
          type="text"
          placeholder="🔍 Search by product name or seller email..."
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {Object.entries(filteredGroupedData).map(
        ([email, { sellerName, products }]) => (
          <div
            key={email}
            className="mb-10 border rounded-lg shadow p-4 bg-white"
          >
            <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                {sellerName}{" "}
                <span className="text-sm text-gray-500 ml-2 break-all">
                  ({email})
                </span>
              </h2>
              <span className="text-sm text-gray-500 mt-2 md:mt-0">
                Total Products: {products.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Image
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Price
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-2">
                        <img
                          src={product.productImages?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded"
                        />
                      </td>
                      <td className="px-3 sm:px-4 py-2 font-medium text-gray-800 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-3 sm:px-4 py-2 text-gray-600 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-3 sm:px-4 py-2 text-orange-600 font-semibold whitespace-nowrap">
                        ৳ {product.price}
                      </td>
                      <td className="px-3 sm:px-4 py-2 capitalize text-gray-700 whitespace-nowrap">
                        {product.type}
                      </td>
                      <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                        <Link
                          href={`/product/${product.slug}`}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md transition"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AffiliateProductsPage;
