"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaBoxOpen } from "react-icons/fa";
import Image from "next/image";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [placeholder, setPlaceholder] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const fullText = "Search Products...";

  useEffect(() => {
    let index = 0;
    let typing = true;
    const interval = setInterval(() => {
      if (typing) {
        setPlaceholder(fullText.slice(0, index) + "|");
        index++;
        if (index > fullText.length) typing = false;
      } else {
        setPlaceholder("|");
        index = 0;
        typing = true;
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim()) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/product/search-suggestions?query=${searchTerm}`
          );
          const data = await res.json();
          const result = Array.isArray(data) ? data : data?.suggestions || [];
          setSuggestions(result);
        } catch (err) {
          console.error("Failed to fetch suggestions:", err);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`);
      setShowSearch(false);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSearch(false);
    router.push(`/product/${slug}`);
  };

  const NoResults = () => (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-gray-500">
      <FaBoxOpen size={32} className="text-gray-400" />
      <p className="text-sm font-medium">No products found</p>
      <p className="text-xs text-gray-400">Try a different search term</p>
    </div>
  );

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:flex w-full max-w-lg relative" ref={searchRef}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pl-12 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F85606] text-gray-700 placeholder-gray-400 shadow-sm transition"
        />
        <button
          onClick={handleSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-[#F85606] text-white p-2 rounded-full hover:bg-[#e04d00] transition shadow-md"
        >
          <FaSearch size={16} />
        </button>

        {searchTerm.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-80 overflow-y-auto">
            {suggestions.length > 0 ? (
              <ul>
                {suggestions.map((product, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectSuggestion(product.slug)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
                  >
                    {product?.productImages?.[0] && (
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                          src={product.productImages[0]}
                          alt={product.name}
                          fill
                          className="object-contain rounded"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-grow">
                      <p className="text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      {product.discountPrice &&
                      product.discountPrice < product.price ? (
                        <>
                          <p className="text-xs text-gray-400 line-through">
                            ৳ {product.price?.toLocaleString()}
                          </p>
                          <p className="text-[#F85606] font-semibold text-sm">
                            ৳ {product.discountPrice?.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-[#F85606] font-semibold text-sm">
                          ৳ {product.price?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <NoResults />
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Button */}
      <button
        className="md:hidden mr-2 flex items-center justify-center text-white bg-[#F85606] hover:bg-[#e04d00] rounded-full p-2 shadow-lg transition transform hover:scale-105 border border-white"
        onClick={() => setShowSearch(!showSearch)}
      >
        <FaSearch />
      </button>

      {/* Mobile Search Panel */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 px-4 z-50"
            ref={searchRef}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoFocus
                className="pl-12 pr-3 py-2.5 rounded-full border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#F85606] text-gray-700 placeholder-gray-400 text-sm shadow-md"
              />
              <button
                onClick={handleSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white text-[#F85606] border border-[#F85606] p-2 rounded-full shadow hover:bg-[#F85606] hover:text-white transition duration-200"
              >
                <FaSearch size={14} />
              </button>
            </div>

            {searchTerm.trim() && (
              <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {suggestions.map((product, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectSuggestion(product.slug)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
                      >
                        {product?.productImages?.[0] && (
                          <div className="relative h-10 w-10 flex-shrink-0">
                            <Image
                              src={product.productImages[0]}
                              alt={product.name}
                              fill
                              className="object-contain rounded"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="flex flex-col flex-grow">
                          <p className="text-sm font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right min-w-[80px]">
                          {product.discountPrice &&
                          product.discountPrice < product.price ? (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                ৳ {product.price?.toLocaleString()}
                              </p>
                              <p className="text-[#F85606] font-semibold text-sm">
                                ৳ {product.discountPrice?.toLocaleString()}
                              </p>
                            </>
                          ) : (
                            <p className="text-[#F85606] font-semibold text-sm">
                              ৳ {product.price?.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <NoResults />
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
