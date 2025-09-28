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
}

interface SubSlug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentSlug: Slug;
  innerSubSlugs?: string[];
  status: boolean;
  createdAt: string;
}

export default function SubSlugsPage() {
  const [subSlugs, setSubSlugs] = useState<SubSlug[]>([]);
  const [slugs, setSlugs] = useState<Slug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubSlug, setEditingSubSlug] = useState<SubSlug | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentSlug: "",
    innerSubSlugs: [] as string[],
    status: true,
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchSubSlugs();
    fetchSlugs();
  }, []);

  const fetchSubSlugs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subslug`);
      setSubSlugs(response.data.result === "Done" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching subslugs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlugs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/slug`);
      setSlugs(response.data.result === "Done" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching slugs:", error);
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
      
      if (editingSubSlug) {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/subslug/${editingSubSlug._id}`, {
          name: formData.name,
          description: formData.description,
          parentSlug: formData.parentSlug,
          innerSubSlugs: formData.innerSubSlugs,
          status: formData.status
        }, config);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subslug`, {
          name: formData.slug,
          parentSlug: formData.parentSlug,
          description: formData.description,
          innerSubSlugs: formData.innerSubSlugs,
          status: formData.status
        }, config);
      }
      
      fetchSubSlugs();
      resetForm();
    } catch (error) {
      console.error("Error saving subslug:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subslug?")) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/subslug/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchSubSlugs();
      } catch (error) {
        console.error("Error deleting subslug:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", parentSlug: "", innerSubSlugs: [], status: true });
    setEditingSubSlug(null);
    setShowModal(false);
  };

  const handleEdit = (subSlug: SubSlug) => {
    setFormData({
      name: subSlug.name,
      slug: subSlug.slug,
      description: subSlug.description || "",
      parentSlug: subSlug.parentSlug?._id || '',
      innerSubSlugs: subSlug.innerSubSlugs || [],
      status: subSlug.status,
    });
    setEditingSubSlug(subSlug);
    setShowModal(true);
  };

  const filteredSubSlugs = subSlugs.filter(subSlug =>
    subSlug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subSlug.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subSlug.parentSlug && subSlug.parentSlug.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SubSlug Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#F6550C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"
        >
          <Plus size={20} />
          Add SubSlug
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search subslugs..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SubSlug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inner SubSlugs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubSlugs.map((subSlug) => (
              <tr key={subSlug._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subSlug.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subSlug.parentSlug?.name || 'No Parent'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{subSlug.description || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {subSlug.innerSubSlugs && subSlug.innerSubSlugs.length > 0 ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {subSlug.innerSubSlugs.length} inner subslug{subSlug.innerSubSlugs.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${subSlug.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {subSlug.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(subSlug)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(subSlug._id)}
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
            <h2 className="text-xl font-bold mb-4">{editingSubSlug ? 'Edit SubSlug' : 'Add New SubSlug'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">SubSlug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Slug</label>
                <select
                  value={formData.parentSlug}
                  onChange={(e) => setFormData({ ...formData, parentSlug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Parent Slug</option>
                  {slugs.map((slug) => (
                    <option key={slug._id} value={slug._id}>
                      {slug.name}
                    </option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Inner SubSlugs</label>
                <div className="space-y-2">
                  {formData.innerSubSlugs.map((innerSubSlug, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={innerSubSlug}
                        onChange={(e) => {
                          const newInnerSubSlugs = [...formData.innerSubSlugs];
                          newInnerSubSlugs[index] = e.target.value;
                          setFormData({ ...formData, innerSubSlugs: newInnerSubSlugs });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newInnerSubSlugs = formData.innerSubSlugs.filter((_, i) => i !== index);
                          setFormData({ ...formData, innerSubSlugs: newInnerSubSlugs });
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, innerSubSlugs: [...formData.innerSubSlugs, ''] })}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Inner SubSlug
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
                  {editingSubSlug ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}