"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/app/lib/utils/withAuth";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    slug: "",
    logo: ""
  });
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    logo: ""
  });
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`);
      const data = await res.json();
      setBrands(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load brands", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBrand.name || !newBrand.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newBrand)
      });

      if (res.ok) {
        toast.success("Brand created successfully");
        setNewBrand({ name: "", slug: "", logo: "" });
        setShowForm(false);
        fetchBrands();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(`Failed to create brand: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Failed to create brand");
    }
  };

  const startEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setEditForm({
      name: brand.name,
      logo: brand.logo
    });
  };

  const cancelEdit = () => {
    setEditingBrand(null);
    setEditForm({ name: "", logo: "" });
  };

  const saveEdit = async () => {
    if (!editingBrand || !editForm.name) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand/${editingBrand._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          logo: editForm.logo,
          slug: generateSlug(editForm.name)
        })
      });

      if (res.ok) {
        toast.success("Brand updated successfully");
        cancelEdit();
        fetchBrands();
      } else {
        toast.error("Failed to update brand");
      }
    } catch (error) {
      toast.error("Failed to update brand");
    }
  };

  const deleteBrand = async (brandId: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand/${brandId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success("Brand deleted successfully");
        fetchBrands();
      } else {
        toast.error("Failed to delete brand");
      }
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const createDefaultBrands = async () => {
    const defaultBrands = [
      { name: "Apple", slug: "apple", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMOL3xGgD9bx0p8QhGjP5R8L5kQY5J5J5J5A&s" },
      { name: "Samsung", slug: "samsung", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQY5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5JA&s" },
      { name: "Sony", slug: "sony", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5A&s" },
      { name: "Nike", slug: "nike", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5A&s" },
      { name: "Adidas", slug: "adidas", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5A&s" }
    ];

    try {
      let successCount = 0;
      for (const brand of defaultBrands) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(brand)
        });
        
        if (res.ok) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`Created ${successCount} brands successfully!`);
        fetchBrands();
      } else {
        toast.error("Failed to create brands. Please check your permissions.");
      }
    } catch (error) {
      toast.error("Failed to create brands");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Brand Management</h1>
      
      

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Brand"}
        </button>
        
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Brand</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand Name</label>
              <input
                type="text"
                value={newBrand.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setNewBrand({
                    ...newBrand,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Apple"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={newBrand.slug}
                onChange={(e) => setNewBrand({...newBrand, slug: e.target.value})}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., apple"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                type="url"
                value={newBrand.logo}
                onChange={(e) => setNewBrand({...newBrand, logo: e.target.value})}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/logo.jpg"
              />
            </div>
            
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Create Brand
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Brands ({brands.length})</h2>
        {brands.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No brands found. Add some brands above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <div key={brand._id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-3 overflow-hidden flex items-center justify-center">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Logo</span>
                  )}
                </div>
                {editingBrand?._id === brand._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full p-1 border rounded text-sm"
                      placeholder="Brand name"
                    />
                    <input
                      type="url"
                      value={editForm.logo}
                      onChange={(e) => setEditForm({...editForm, logo: e.target.value})}
                      className="w-full p-1 border rounded text-sm"
                      placeholder="Logo URL"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{brand.name}</h3>
                      <p className="text-sm text-gray-500">{brand.slug}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(brand)}
                        className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBrand(brand._id)}
                        className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
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
      <BrandsPage />
    </WithAuth>
  );
}