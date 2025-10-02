"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import ProductCart from "@/app/(commonLayout)/components/ui/ProductCart";
import ProductCardSkeleton from "@/app/(commonLayout)/components/skeleton/ProductCardSkeleton";
import { Dialog } from "@headlessui/react";
import { Filter, X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  productImages: string[];
  brand: string;
  category: string;
  stockQuantity: number;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  status: string;
}

export default function FilterableProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFromURL = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [dynamicBrands, setDynamicBrands] = useState<any[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showNewArrival, setShowNewArrival] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("category")]);
  // Sync URL category to local state
  useEffect(() => {
    setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        let list: Product[] = res.data.data;

        setBrands([...new Set(list.map((p) => p.brand))]);
        setCategories([...new Set(list.map((p) => p.category))]);
        
        // Fetch dynamic categories and brands from API
        await fetchDynamicCategories();
        await fetchDynamicBrands();

        console.log('Total products before filtering:', list.length);
        
        list = list.filter((p) => {
          const inBrand = selectedBrand
            ? dynamicBrands.some(brand => 
                brand.slug === selectedBrand && 
                (brand.name === p.brand || brand.slug === p.brand)
              )
            : true;
          const inPrice =
            (p.discountPrice || p.price) >= priceRange[0] &&
            (p.discountPrice || p.price) <= priceRange[1];
          const inStock = onlyInStock ? p.stockQuantity > 0 : true;
          const isFeaturedMatch = showFeatured ? p.isFeatured : true;
          const isNewArrivalMatch = showNewArrival ? p.isNewArrival : true;
          const isActive = p.status === "active";
          const inCategory = selectedCategory
            ? p.category.toLowerCase() === selectedCategory.toLowerCase() || 
              dynamicCategories.some(cat => 
                (cat.slug.toLowerCase() === selectedCategory.toLowerCase() && 
                 (cat.name.toLowerCase() === p.category.toLowerCase() || 
                  cat.slug.toLowerCase() === p.category.toLowerCase()))
              )
            : true;

          // Debug ProShot camera specifically
          if (p.name.includes('ProShot')) {
            console.log('ProShot Camera Debug:', {
              name: p.name,
              brand: p.brand,
              category: p.category,
              status: p.status,
              price: p.price,
              discountPrice: p.discountPrice,
              stockQuantity: p.stockQuantity,
              inBrand,
              inPrice,
              inStock,
              isFeaturedMatch,
              isNewArrivalMatch,
              isActive,
              inCategory,
              priceRange,
              selectedBrand,
              selectedCategory
            });
          }

          return (
            inBrand &&
            inPrice &&
            inStock &&
            isFeaturedMatch &&
            isNewArrivalMatch &&
            inCategory &&
            isActive
          );
        });

        console.log('Total products after filtering:', list.length);
        setProducts(list);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
        setCurrentPage(1);
      }
    };

    fetchProducts();
  }, [
    selectedBrand,
    priceRange,
    showFeatured,
    showNewArrival,
    onlyInStock,
    selectedCategory,
  ]);

  const fetchDynamicCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const data = await res.json();
      setDynamicCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load categories", error);
      setDynamicCategories([]);
    }
  };

  const fetchDynamicBrands = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`);
      const data = await res.json();
      setDynamicBrands(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load brands", error);
      setDynamicBrands([]);
    }
  };

  const displayed = products.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(products.length / perPage);

  const resetMobile = () => setIsMobileFilterOpen(false);

  const resetFilters = () => {
    setSelectedBrand("");
    setPriceRange([0, 999999]);
    setShowFeatured(false);
    setShowNewArrival(false);
    setOnlyInStock(false);
    setSelectedCategory("");
    setCurrentPage(1);
    router.push("/products");
  };

  const renderFilters = () => (
    <div className="border p-4 rounded space-y-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-orange-600 hover:text-orange-800"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Category</p>
        {dynamicCategories.map((cat) => (
          <label key={cat._id || cat.slug} className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value={cat.slug}
              checked={selectedCategory === cat.slug}
              onChange={() =>
                router.push(`/products?category=${encodeURIComponent(cat.slug)}`)
              }
            />
            <div className="flex items-center gap-2">
              {cat.bannerImage && (
                <img 
                  src={cat.bannerImage} 
                  alt={cat.name}
                  className="w-4 h-4 rounded object-cover"
                />
              )}
              {cat.name}
            </div>
          </label>
        ))}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="category"
            value=""
            checked={selectedCategory === ""}
            onChange={() => router.push("/products")}
          />
          All Categories
        </label>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Brand</p>
        {dynamicBrands.map((brand) => (
          <label key={brand._id || brand.slug} className="flex items-center gap-2">
            <input
              type="radio"
              name="brand"
              value={brand.slug}
              checked={selectedBrand === brand.slug}
              onChange={() => setSelectedBrand(brand.slug)}
            />
            <div className="flex items-center gap-2">
              {brand.logo && (
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-4 h-4 rounded object-cover"
                />
              )}
              {brand.name}
            </div>
          </label>
        ))}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="brand"
            value=""
            checked={selectedBrand === ""}
            onChange={() => setSelectedBrand("")}
          />
          All Brands
        </label>
      </div>

      <div>
        <label className="block font-medium mb-1">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([
                Math.min(+e.target.value, priceRange[1]),
                priceRange[1],
              ])
            }
            className="w-1/2 p-2 border rounded"
            placeholder="Min"
          />
          <input
            type="number"
            min={priceRange[0]}
            max={999999}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([
                priceRange[0],
                Math.max(+e.target.value, priceRange[0]),
              ])
            }
            className="w-1/2 p-2 border rounded"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={() => setOnlyInStock(!onlyInStock)}
          />
          In Stock Only
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFeatured}
            onChange={() => setShowFeatured(!showFeatured)}
          />
          Featured Products
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showNewArrival}
            onChange={() => setShowNewArrival(!showNewArrival)}
          />
          New Arrivals
        </label>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 mt-10 min-h-screen">
      <div className="lg:hidden mb-4 flex justify-center">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded bg-white shadow-sm hover:shadow-md transition"
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block lg:w-1/5 bg-white p-5 rounded-lg shadow-md sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
          {renderFilters()}
        </aside>

        {/* Main Product Section */}
        <section className="flex-1 lg:w-4/5">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {Array.from({ length: perPage }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center py-24 text-gray-400 italic text-lg font-semibold">
              No products found.
            </p>
          ) : (
            <>
              {/* Pagination Info */}
              <div className="mb-6 text-sm text-gray-600 flex flex-wrap justify-center lg:justify-start gap-3">
                <span>Showing</span>
                <span className="font-semibold text-orange-600">
                  {(currentPage - 1) * perPage + 1} –{" "}
                  {Math.min(currentPage * perPage, products.length)}
                </span>
                <span>of</span>
                <span className="font-semibold text-orange-600">
                  {products.length}
                </span>
                <span>products</span>
              </div>

              {/* Products Grid */}
              <ProductCart products={displayed} />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav
                  className="mt-10 flex justify-center space-x-4"
                  aria-label="Pagination"
                >
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-5 py-2 rounded-md border font-medium transition-colors focus:outline-none ${
                        currentPage === i + 1
                          ? "bg-orange-600 text-white border-orange-600 shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
                      }`}
                      aria-current={currentPage === i + 1 ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
        </section>
      </div>

      <Dialog
        open={isMobileFilterOpen}
        onClose={resetMobile}
        className="relative z-50 lg:hidden"
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Slide-in panel */}
        <div className="fixed inset-0 flex items-end justify-center sm:items-center p-4 overflow-y-auto">
          <Dialog.Panel className="bg-white w-full max-w-sm rounded-t-lg sm:rounded-lg shadow-xl transform transition-all duration-300 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Filters
              </Dialog.Title>
              <button
                onClick={resetMobile}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close filter panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter content */}
            <div className="px-5 py-4 overflow-y-auto max-h-[75vh]">
              {renderFilters()}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
