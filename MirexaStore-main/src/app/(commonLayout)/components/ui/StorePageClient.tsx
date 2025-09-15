"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCart from "./ProductCart"; // Make sure this path is correct
import Image from "next/image";
import { MdVerified } from "react-icons/md";

interface Brand {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logo?: string;
  banner?: string;
  location?: string;
  verified?: boolean;
  joinedAt?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
}

interface SellerProfile {
  _id: string;
  userEmail: string;
  brand: Brand;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  sellerEmail: string;
  stockQuantity: number;
  stock: number; // ✅ FIXED: should be number to match ProductCart
  category: string;
  productImages: string[];
  slug: string;
  [key: string]: any;
}

export default function StorePageClient({ seller }: { seller: SellerProfile }) {
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  console.log(products);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsAuthenticated(true);

    const fetchFollowData = async () => {
      try {
        // Always get followers count
        const followersRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/followers/${seller._id}`
        );
        setFollowersCount(followersRes.data.followers || 0);

        // Conditionally get isFollowing only if token exists
        if (token) {
          const isFollowingRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/seller/is-following?sellerId=${seller._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsFollowing(isFollowingRes.data.isFollowing || false);
        } else {
          setIsFollowing(false); // fallback
        }
      } catch (err) {
        console.error("Error fetching follow state:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`);

        const allProducts = res.data.data || [];

        const filtered = allProducts
          .filter(
            (product: any) =>
              product.sellerEmail === seller.userEmail &&
              product.status === "active" // ✅ active only
          )
          .map((product: any) => ({
            ...product,
            stockQuantity: product.stockQuantity ?? 0,
            stock: typeof product.stock === "number" ? product.stock : 1, // ✅ ensure number
            category: product.category ?? "Uncategorized",
            productImages: product.productImages ?? [product.image],
            slug:
              product.slug ?? product.name.toLowerCase().replace(/\s+/g, "-"),
          }));

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchFollowData();
    fetchProducts();
  }, [seller._id, seller.userEmail]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "/login"; // You can also use a route like "/auth/login" if needed
      return;
    }

    const url = isFollowing ? "unfollow" : "follow";

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/${url}`,
        { sellerId: seller._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Follow/Unfollow failed:", err);
    }
  };

  const brand = seller.brand;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {brand.banner && (
        <div className="rounded-2xl overflow-hidden mb-6">
          <Image
            src={brand.banner}
            alt={`${brand.name} banner`}
            width={1200} // Adjust based on your layout
            height={288} // 72 * 4 (sm:h-72)
            className="w-full h-56 sm:h-72 object-cover"
            style={{ width: "100%" }}
            priority // optional: speeds up loading for above-the-fold images
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
        {brand.logo && (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={96} // 24 * 4 (sm:w-24)
            height={96}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-300 shadow"
            style={{ height: "auto" }}
          />
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {brand.name}
          </h1>
          {brand.tagline && (
            <p className="text-gray-600 mt-1">{brand.tagline}</p>
          )}
          {brand.verified && (
            <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              <MdVerified className="h-4 w-4" />
              <span>Verified seller</span>
            </div>
          )}
          <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start">
            <span className="text-sm text-gray-500">
              👥 {followersCount} follower{followersCount !== 1 && "s"}
            </span>

            <button
              onClick={handleFollowToggle}
              className={`px-4 py-1 rounded-full text-sm font-medium border ${
                isFollowing
                  ? "bg-gray-100 text-gray-800 border-gray-300"
                  : "bg-blue-600 text-white border-blue-600"
              } transition`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      {brand.description && (
        <p className="text-gray-700 leading-relaxed text-base mb-8 max-w-2xl whitespace-pre-wrap">
          {brand.description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 mb-12">
        <p>
          <strong>📍 Location:</strong> {brand.location || "N/A"}
        </p>

        <p>
          <strong>📅 Joined:</strong>{" "}
          {brand.joinedAt
            ? new Date(brand.joinedAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>
        {products.length > 0 ? (
          <ProductCart products={products} />
        ) : (
          <p className="text-gray-500">No products found for this seller.</p>
        )}
      </div>
    </div>
  );
}
