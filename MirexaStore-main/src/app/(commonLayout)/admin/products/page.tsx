"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Loading from "@/app/loading";
import WithAuth from "@/app/lib/utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

const AdminProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Track the selected category
  const [categories, setCategories] = useState<string[]>([]); // All categories
  const [allCategories, setAllCategories] = useState<any[]>([]); // Full category objects
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>(""); // For searching by name
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null); // For storing product ID to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // To track if the modal is open
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const data = await response.json();
      setAllCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product`
        );
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setLoading(false);

        const uniqueCategories = [
          ...new Set(
            response.data.data.map((product: any) => product.category)
          ),
        ] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        toast.error("Error fetching products!");
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    fetchCategories();
  }, []);

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
    return (
      <p className="text-center text-gray-500">
        <Loading></Loading>
      </p>
    );
  }

  const [newCategory, setNewCategory] = useState({ name: "", slug: "", bannerImage: "" });
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        toast.success("Category created successfully!");
        setNewCategory({ name: "", slug: "", bannerImage: "" });
        setShowCategoryForm(false);
        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create category");
      console.error("Error creating category:", error);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const createDefaultCategories = async () => {
    const defaultCategories = [
      { name: "Electronics", slug: "electronics", bannerImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400" },
      { name: "Wearables", slug: "wearables", bannerImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
      { name: "Audio", slug: "audio", bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
      { name: "Accessories", slug: "accessories", bannerImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
      { name: "Bags", slug: "bags", bannerImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
      { name: "Cameras", slug: "cameras", bannerImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400" },
      { name: "Home Appliances", slug: "home-appliances", bannerImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
      { name: "Kitchen Appliances", slug: "kitchen-appliances", bannerImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" }
    ];

    try {
      for (const category of defaultCategories) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/category`,
          category,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
      }
      toast.success("Default categories created successfully!");
      fetchCategories();
    } catch (error: any) {
      toast.error("Some categories may already exist or failed to create");
      console.error("Error creating default categories:", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Product & Category Management
      </h1>

      {/* Category Management Section */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Category Management</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {showCategoryForm ? "Cancel" : "Add Category"}
            </button>
            
          </div>
        </div>
        
        {showCategoryForm && (
          <form onSubmit={handleCreateCategory} className="bg-white p-4 rounded-md shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCategory({
                      ...newCategory,
                      name,
                      slug: generateSlug(name)
                    });
                  }}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Electronics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., electronics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={newCategory.bannerImage}
                  onChange={(e) => setNewCategory({...newCategory, bannerImage: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Category
              </button>
            </div>
          </form>
        )}
        
        {/* Existing Categories List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Existing Categories ({allCategories.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allCategories.map((category) => (
              <div key={category._id} className="bg-white p-3 rounded border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img 
                    src={category.bannerImage || "https://via.placeholder.com/40"} 
                    alt={category.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteCategory(category._id)}
                  className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  ${product.price}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.category}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.stockQuantity}
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex justify-start gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/products/${product._id}`)
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
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <AdminProductPage />
    </WithAuth>
  );
}
