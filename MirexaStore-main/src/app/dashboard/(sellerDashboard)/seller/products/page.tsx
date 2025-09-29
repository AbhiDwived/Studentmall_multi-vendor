"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Loading from "@/app/loading";
import WithAuth from "@/lib/utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import Link from "next/link";
import ConfirmationModal from "@/app/(commonLayout)/components/ConfirmationModal/ConfirmationModal";
import ProductTableSkeleton from "../components/skeletons/ProductTableSkeleton";

const AdminProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Track the selected category
  const [categories, setCategories] = useState<string[]>([]); // All categories
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(999999);
  const [searchQuery, setSearchQuery] = useState<string>(""); // For searching by name
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null); // For storing product ID to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // To track if the modal is open
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product`
        );

        const allProducts = response.data.data;
        const loggedInUserEmail = user?.email;

        const sellerProducts = allProducts.filter(
          (product: any) => product.sellerEmail === loggedInUserEmail
        );

        setProducts(sellerProducts);
        setFilteredProducts(sellerProducts);
        setLoading(false);

        const uniqueCategories = [
          ...new Set(sellerProducts.map((product: any) => product.category)),
        ] as string[];

        setCategories(uniqueCategories);
      } catch (error) {
        toast.error("Error fetching products!");
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  useEffect(() => {
    // Filter products based on selected category, price range, and search query
    const filterProducts = () => {
      let filtered = [...products];

      if (selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }

      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (minPrice || maxPrice) {
        filtered = filtered.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts(); // Apply filters whenever any of the state values change
  }, [selectedCategory, searchQuery, minPrice, maxPrice, products]);

  const handleDeleteClick = (productId: string) => {
    setDeleteProductId(productId); // Set the product ID to delete
    setIsModalOpen(true); // Open the confirmation modal
  };
  const token = useSelector((state: RootState) => state.auth.token);

  const handleDelete = async () => {
    if (!deleteProductId) return;

    if (!token) {
      toast.error("Authentication token is missing!");
      console.error("Authentication token is missing");
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/status/${deleteProductId}`, // Use PATCH instead of DELETE
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter out the product from the list but keep it marked as inactive
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === deleteProductId
            ? { ...product, status: "inactive" }
            : product
        )
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.map((product) =>
          product._id === deleteProductId
            ? { ...product, status: "inactive" }
            : product
        )
      );
      toast.success("Product status updated to inactive!");
    } catch (error) {
      toast.error("Error updating product status!");
      console.error("Error updating product status:", error);
    } finally {
      setIsModalOpen(false); // Close the modal after updating
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal without deletion
  };

  if (loading) {
    return <ProductTableSkeleton></ProductTableSkeleton>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Product Management
      </h1>

      {/* Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this product?"
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-full sm:w-48"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md w-full sm:w-auto"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="px-3 py-2 border rounded-md w-full sm:w-28"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="px-3 py-2 border rounded-md w-full sm:w-28"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Price
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Stock Quantity
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">
                  <Link
                    href={`/product/${product.urlSlug || product._id}`}
                    className="block hover:underline text-gray-800"
                  >
                    <div className="text-sm py-3 px-4">
                      {product.name}
                      {typeof product.averageRating === "number" && (
                        <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                          <span>⭐ {product.averageRating.toFixed(1)}</span>
                          <span className="text-gray-500 font-normal">
                            ({product.totalReviews ?? 0})
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  ₹{product.price}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.category}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.stockQuantity}
                </td>
                <td
                  className={`py-3 px-4 text-sm 
					${product.status === "active" ? "text-green-600" : ""}
					${product.status === "inactive" ? "text-red-600" : ""}
					${product.status === "draft" ? "text-yellow-600" : ""}
				  `}
                >
                  {product.status}
                </td>

                <td className="py-3 px-4 text-sm">
                  <div className="flex justify-start gap-2">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/seller/products/${product._id}`)
                      }
                      className="text-blue-500 hover:text-blue-700 py-1 px-3 rounded-md border border-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="text-red-500 hover:text-red-700 py-1 px-3 rounded-md border border-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <AdminProductPage />
    </WithAuth>
  );
}
