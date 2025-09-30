"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/lib/utils/withAuth";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  bannerImage: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    bannerImage: ""
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    bannerImage: ""
  });

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const data = await res.json();
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load categories", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      });

      if (res.ok) {
        toast.success("Category created successfully");
        setNewCategory({ name: "", slug: "", bannerImage: "" });
        setShowForm(false);
        fetchCategories();
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          toast.error("Permission denied: Please check your seller permissions.");
        } else {
          toast.error(`Failed to create category: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      bannerImage: category.bannerImage
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: "", bannerImage: "" });
  };

  const saveEdit = async () => {
    if (!editingCategory || !editForm.name) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          bannerImage: editForm.bannerImage,
          slug: generateSlug(editForm.name)
        })
      });

      if (res.ok) {
        toast.success("Category updated successfully");
        cancelEdit();
        fetchCategories();
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          toast.error("Permission denied: You can only delete categories you created.");
        } else {
          toast.error(`Failed to delete category: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      toast.error("Failed to delete category");
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
      let successCount = 0;
      for (const category of defaultCategories) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(category)
        });
        
        if (res.ok) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`Created ${successCount} categories successfully!`);
        fetchCategories();
      } else {
        toast.error("Failed to create categories. Please check your permissions.");
      }
    } catch (error) {
      toast.error("Failed to create categories");
    }
  };

  if (loading) return <div className="p-4 sm:p-6">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Category Management</h1>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
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
            
            <div className="sm:col-span-2 lg:col-span-1">
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
            
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium mb-1">Banner Image URL</label>
              <input
                type="url"
                value={newCategory.bannerImage}
                onChange={(e) => setNewCategory({...newCategory, bannerImage: e.target.value})}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Categories ({categories.length})</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No categories found. Add some categories above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category._id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="relative w-full h-32 bg-gray-200 rounded-md mb-3 overflow-hidden">
                  {category.bannerImage && (
                    <Image
                      src={category.bannerImage}
                      alt={category.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                {editingCategory?._id === category._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="Category name"
                    />
                    <input
                      type="url"
                      value={editForm.bannerImage}
                      onChange={(e) => setEditForm({...editForm, bannerImage: e.target.value})}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="Image URL"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 w-full sm:w-auto"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm sm:text-base">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{category.slug}</p>
                    </div>
                    <div className="flex gap-2 sm:gap-1">
                      <button
                        onClick={() => startEdit(category)}
                        className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 flex-1 sm:flex-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category._id)}
                        className="text-red-600 hover:text-red-800 text-sm px-2 py-1 flex-1 sm:flex-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <CategoriesPage />
    </WithAuth>
  );
}
