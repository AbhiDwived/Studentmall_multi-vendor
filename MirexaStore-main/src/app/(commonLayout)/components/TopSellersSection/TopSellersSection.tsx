"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Seller {
  _id: string;
  brand: {
    name: string;
    slug: string;
    logo: string;
    banner: string;
    tagline: string;
    location: string;
    verified: boolean;
  };
}

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow border animate-pulse">
    <div className="bg-gray-200 h-16 sm:h-32 w-full"></div>
    <div className="p-2 sm:p-4 relative">
      <div className="absolute -top-3 sm:-top-6 left-2 sm:left-4">
        <div className="w-[32px] h-[32px] sm:w-[60px] sm:h-[60px] bg-gray-300 rounded-full border-2 sm:border-4 border-white"></div>
      </div>
      <div className="mt-3 sm:mt-6 pl-10 sm:pl-20 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mt-1"></div>
        <div className="h-5 w-20 bg-gray-300 rounded mt-3"></div>
      </div>
    </div>
  </div>
);

const TopSellerSection = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSellers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/all-sellers`
        );
        const data = await res.json();
        setSellers(data?.data || []);
      } catch (err) {
        console.error("Failed to load sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    getSellers();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">
        Top Sellers
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <p className="text-center text-gray-500">No sellers found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.slice(0, 6).map((seller) => (
            <Link
              href={`/stores/${seller.brand.slug}`}
              key={seller._id}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition border"
            >
              <div className="relative h-16 sm:h-32 bg-gray-100">
                {seller.brand.banner && (
                  <Image
                    src={seller.brand.banner}
                    alt={`${seller.brand.name} banner`}
                    fill
                    className="object-contain w-full h-full"
                  />
                )}
              </div>

              <div className="p-2 sm:p-4 relative">
                <div className="absolute -top-3 sm:-top-6 left-2 sm:left-4">
                  <Image
                    src={seller.brand.logo}
                    alt={seller.brand.name}
                    width={32}
                    height={32}
                    className="sm:w-[60px] sm:h-[60px] rounded-full border-2 sm:border-4 border-white shadow-md object-cover"
                  />
                </div>

                <div className="mt-3 sm:mt-6 pl-10 sm:pl-20 text-left">
                  <h2 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
                    {seller.brand.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {seller.brand.location}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 italic line-clamp-1 sm:line-clamp-2 mt-1">
                    {seller.brand.tagline}
                  </p>

                  {seller.brand.verified && (
                    <span className="inline-block mt-1 sm:mt-2 text-[10px] sm:text-xs text-green-600 font-medium bg-green-50 px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                      ✅ Verified
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 sm:mt-10 text-center">
        <Link
          href="/stores"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          View All Sellers
        </Link>
      </div>
    </main>
  );
};

export default TopSellerSection;
