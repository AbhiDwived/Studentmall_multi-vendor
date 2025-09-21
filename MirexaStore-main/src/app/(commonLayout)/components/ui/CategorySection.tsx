"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
  bannerImage: string;
}

interface Props {
  categories: Category[];
}

export default function CategorySection({ categories }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        No categories available. Please add categories from admin panel.
      </div>
    );
  }

  const duplicatedCategories = [...categories, ...categories];

  useEffect(() => {
    if (!isHovered && categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= categories.length - 1) {
            setTimeout(() => {
              setIsTransitioning(true);
              setCurrentIndex(0);
              setTimeout(() => setIsTransitioning(false), 50);
            }, 500);
            return prev + 1;
          }
          return prev + 1;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, categories.length]);

  const handleCategoryClick = (slug: string) => {
    router.push(`/products?category=${slug}`);
  };

  return (
    <section className="w-full py-12 px-2 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
        🛒 Browse Categories
      </h2>

      <div 
        className="relative overflow-hidden mx-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`flex ${isTransitioning ? '' : 'transition-transform duration-500 ease-in-out'}`}
          style={{ transform: `translateX(-${currentIndex * (100/6)}%)` }}
        >
          {duplicatedCategories.map((category, index) => (
            <div
              key={`${category._id}-${index}`}
              className="flex-shrink-0 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 px-0.5 cursor-pointer"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="group border rounded-lg bg-white shadow-sm hover:shadow-md transition flex flex-col items-center text-center p-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={category.bannerImage || "https://via.placeholder.com/100x100?text=Category"}
                    alt={category.name}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/100x100?text=Category";
                    }}
                  />
                </div>
                <h3 className="mt-2 text-xs sm:text-sm font-medium text-gray-800 group-hover:text-[#F6550C] transition">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
