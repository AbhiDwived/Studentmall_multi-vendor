"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import { toast, ToastContainer } from "react-toastify";
import BrandSkeleton from "../components/skeleton/BrandSkeleton";

type BrandType = {
  _id: string;
  brand: {
    name: string;
    slug: string;
    logo: string;
    tagline: string;
    description: string;
    verified: boolean;
  };
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [isFollowingMap, setIsFollowingMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [followersCountMap, setFollowersCountMap] = useState<{
    [key: string]: number;
  }>({});
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/all-sellers`
        );
        const sellers = res.data.data || [];
        setBrands(sellers);

        // Fetch follow info
        for (const seller of sellers) {
          fetchFollowInfo(seller._id);
        }
      } catch (err) {
        console.error("Failed to load brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [token]);

  const fetchFollowInfo = async (id: string) => {
    try {
      const followersRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/followers/${id}`
      );
      setFollowersCountMap((prev) => ({
        ...prev,
        [id]: followersRes.data.followers || 0,
      }));

      if (token) {
        const isFollowingRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/is-following?sellerId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFollowingMap((prev) => ({
          ...prev,
          [id]: isFollowingRes.data.isFollowing || false,
        }));
      } else {
        setIsFollowingMap((prev) => ({
          ...prev,
          [id]: false,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch follow info:", err);
    }
  };

  const handleFollowToggle = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to follow.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    const isCurrentlyFollowing = isFollowingMap[id];
    const endpoint = isCurrentlyFollowing ? "unfollow" : "follow";

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/${endpoint}`,
        { sellerId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowingMap((prev) => ({
        ...prev,
        [id]: !isCurrentlyFollowing,
      }));

      setFollowersCountMap((prev) => ({
        ...prev,
        [id]: isCurrentlyFollowing ? prev[id] - 1 : prev[id] + 1,
      }));
    } catch (err) {
      console.error("Follow/Unfollow failed:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Verified & Trending Shops
      </h1>

      <div className="space-y-4">
        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <BrandSkeleton key={i} />
            ))}
          </>
        ) : (
          brands.map(({ _id, brand }) => (
            <Link
              href={`/stores/${brand.slug}`}
              key={_id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg shadow-sm hover:shadow transition"
            >
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    {brand.name}
                    {brand.verified && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-medium">
                        Verified
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {brand.tagline || brand.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    👥 {followersCountMap[_id] ?? 0} follower
                    {followersCountMap[_id] !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="sm:ml-auto">
                <button
                  onClick={(e) => handleFollowToggle(e, _id)}
                  className={`w-full sm:w-auto mt-2 sm:mt-0 px-4 py-1 text-sm rounded transition font-medium border ${
                    isFollowingMap[_id]
                      ? "bg-gray-100 text-gray-800 border-gray-300"
                      : "bg-blue-600 text-white border-blue-600"
                  }`}
                >
                  {isFollowingMap[_id] ? "Following" : "Follow"}
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={2500} />
    </div>
  );
}
