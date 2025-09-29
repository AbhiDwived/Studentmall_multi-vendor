"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/lib/utils/withAuth";
import { Product } from "@/app/types/product.types";
import {
  Package,
  Eye,
  Heart,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

const AdminProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, typeFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(product => product.type === typeFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleBulkStatusUpdate = async (newStatus: 'active' | 'inactive' | 'draft') => {
    if (selectedProducts.length === 0) {
      toast.warning("Please select products to update");
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/bulk-status`,
        { productIds: selectedProducts, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Products status updated to ${newStatus}`);
      fetchProducts();
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'draft': return <Edit className="w-4 h-4 text-yellow-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStockStatus = (product: Product) => {
    if (!product.trackInventory) return null;
    const threshold = product.lowStockThreshold || 10;
    if (product.stockQuantity <= threshold) {
      return <AlertTriangle className="w-4 h-4 text-red-500" title="Low Stock" />;
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage your products with enhanced features
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.isFeatured).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => 
                    p.trackInventory && p.stockQuantity <= (p.lowStockThreshold || 10)
                  ).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="own">Own Products</option>
                <option value="affiliate">Affiliate Products</option>
              </select>
            </div>

            {selectedProducts.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Activate ({selectedProducts.length})
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('inactive')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Deactivate ({selectedProducts.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={() => {
                        if (selectedProducts.length === filteredProducts.length) {
                          setSelectedProducts([]);
                        } else {
                          setSelectedProducts(filteredProducts.map(p => p._id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelect(product._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.productImages[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {product.name}
                            {product.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                            {product.isNewArrival && <TrendingUp className="w-4 h-4 text-blue-500" />}
                            {getStockStatus(product)}
                          </div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.sku || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {product.stockQuantity}
                        {product.trackInventory && product.stockQuantity <= (product.lowStockThreshold || 10) && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(product.status || 'draft')}
                        <span className="text-sm capitalize">{product.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.type === 'affiliate' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {product.viewCount || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {product.wishlistCount || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
