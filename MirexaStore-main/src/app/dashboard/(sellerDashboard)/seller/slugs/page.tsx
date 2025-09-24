"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

interface Slug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  innerSlugs?: string[];
  status: boolean;
  createdAt: string;
}

export default function SlugsPage() {
  const [slugs, setSlugs] = useState<Slug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlug, setEditingSlug] = useState<Slug | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    innerSlugs: [] as string[],
    status: true,
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchSlugs();
  }, []);

  const fetchSlugs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/slug`);
      console.log("Fetched slugs:", response.data);
      setSlugs(response.data.result === "Done" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching slugs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      if (editingSlug) {
        console.log('Updating slug with:', {
          name: formData.name,
          description: formData.description,
          innerSlugs: formData.innerSlugs,
          status: formData.status
        });
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/slug/${editingSlug._id}`, {
          name: formData.name,
          description: formData.description,
          innerSlugs: formData.innerSlugs,
          status: formData.status
        }, config);
      } else {
        console.log('Creating slug with:', {
          name: formData.name,
          description: formData.description,
          innerSlugs: formData.innerSlugs,
          status: formData.status
        });
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/slug`, {
          name: formData.name,
          description: formData.description,
          innerSlugs: formData.innerSlugs,
          status: formData.status
        }, config);
      }
      
      fetchSlugs();
      resetForm();
    } catch (error) {
      console.error("Error saving slug:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this slug?")) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/slug/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchSlugs();
      } catch (error) {
        console.error("Error deleting slug:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", innerSlugs: [], status: true });
    setEditingSlug(null);
    setShowModal(false);
  };

  const handleEdit = (slug: Slug) => {
    console.log("Editing slug:", slug);
    setFormData({
      name: slug.name,
      slug: slug.slug,
      description: slug.description || "",
      innerSlugs: slug.innerSlugs || [],
      status: slug.status,
    });
    console.log("Form data set to:", {
      name: slug.name,
      slug: slug.slug,
      description: slug.description || "",
      innerSlugs: slug.innerSlugs || [],
      status: slug.status,
    });
    setEditingSlug(slug);
    setShowModal(true);
  };

  const filteredSlugs = slugs.filter(slug =>
    slug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slug.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Slug Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#F6550C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"
        >
          <Plus size={20} />
          Add Slug
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search slugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inner Slugs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSlugs.map((slug) => (
              <tr key={slug._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slug.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{slug.description || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {slug.innerSlugs && slug.innerSlugs.length > 0 ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {slug.innerSlugs.length} inner slug{slug.innerSlugs.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${slug.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {slug.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(slug)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(slug._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingSlug ? 'Edit Slug' : 'Add New Slug'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Inner Slugs</label>
                <div className="space-y-2">
                  {formData.innerSlugs.map((innerSlug, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={innerSlug}
                        onChange={(e) => {
                          const newInnerSlugs = [...formData.innerSlugs];
                          newInnerSlugs[index] = e.target.value;
                          setFormData({ ...formData, innerSlugs: newInnerSlugs });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newInnerSlugs = formData.innerSlugs.filter((_, i) => i !== index);
                          setFormData({ ...formData, innerSlugs: newInnerSlugs });
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, innerSlugs: [...formData.innerSlugs, ''] })}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Inner Slug
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F6550C] text-white rounded-md hover:bg-orange-600"
                >
                  {editingSlug ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}