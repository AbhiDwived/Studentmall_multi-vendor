"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WithAuth from "@/app/lib/utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import EditProductSkeleton from "../../components/skeletons/EditProductSkeleton";

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      const currentImages = getImageArray();
      const newImages = [...currentImages, url.trim()].join(', ');
      setProduct((prev: any) => ({ ...prev, productImages: newImages }));
      toast.success('Image added!');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = getImageArray();
    const newImages = currentImages.filter((_: string, i: number) => i !== index).join(', ');
    setProduct((prev: any) => ({ ...prev, productImages: newImages }));
  };

  const getImageArray = () => {
    if (!product?.productImages) return [];
    
    let urls = [];
    if (Array.isArray(product.productImages)) {
      urls = product.productImages;
    } else {
      urls = product.productImages.split(',').map((url: string) => url.trim());
    }
    
    // Further split each URL if it contains multiple URLs
    const finalUrls = urls.flatMap((url: string) => 
      url.includes(',') ? url.split(',').map(u => u.trim()) : [url.trim()]
    ).filter((url: string) => url && url.length > 0);
    
    console.log('✅ Processed URLs:', finalUrls);
    return finalUrls;
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/product/details/${id}`
          );
          console.log('🔍 API Response:', response.data);
          console.log('🔍 Product data:', response.data.data);
          setProduct(response.data.data);
        } catch (err) {
          setError("Error fetching product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setProduct((prevProduct: any) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct: any) => {
      const updatedVariants = [...(prevProduct.variants || [])];
      updatedVariants[index] = { 
        ...updatedVariants[index], 
        [name]: name === "images" ? value.split(", ") : value 
      };
      return {
        ...prevProduct,
        variants: updatedVariants,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication token is missing!");
      return;
    }

    if (!product?.name || !product?.price) {
      toast.error("Name and price are required!");
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/seller/products");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error updating product";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <EditProductSkeleton />;
  if (!product) return <div className="text-center p-8">Product not found</div>;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Edit Product
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Name", id: "name" },
              { label: "Slug", id: "slug" },
              { label: "Materials", id: "materials" },
              { label: "Care Instructions", id: "careInstructions" },
              { label: "Specifications", id: "specifications" },
              { label: "Additional Info", id: "additionalInfo" },
              { label: "Price", id: "price", type: "number" },
              { label: "Discount Price", id: "discountPrice", type: "number" },
              { label: "Stock Quantity", id: "stockQuantity", type: "number" },
              { label: "Brand", id: "brand" },
              { label: "Category", id: "category" },
              { label: "Tags", id: "tags", placeholder: "comma separated" },
              {
                label: "Product Images",
                id: "productImages",
                placeholder: "comma separated URLs",
              },
              { label: "Video URL", id: "videoUrl" },
              {
                label: "Features",
                id: "features",
                placeholder: "comma separated",
              },
              { label: "Notes", id: "notes" },
              { label: "Weight (kg)", id: "weight", type: "number" },
              { label: "Dimensions", id: "dimensions" },
              { label: "Warranty", id: "warranty" },
            ].map(({ label, id, type = "text", placeholder }) => (
              <div key={id}>
                <label
                  className="block mb-1 font-medium text-gray-700"
                  htmlFor={id}
                >
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={product?.[id] || ""}
                  placeholder={placeholder}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product?.description || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="longDescription"
              >
                Long Description
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={product?.longDescription || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Product Images ({getImageArray().length})
              </h2>
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Image URL
              </button>
            </div>
            
            {getImageArray().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getImageArray().map((url: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={url.trim()}
                      alt={`Product ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border shadow-sm"
                      onError={(e) => {
                        console.log('❌ Image failed to load:', url);
                        const target = e.target as HTMLImageElement;
                        // Try a placeholder image from a reliable source
                        target.src = `https://via.placeholder.com/400x300/f7f7f7/999999?text=Product+Image+${index + 1}`;
                      }}
                      onLoad={() => {
                        console.log('✅ Image loaded successfully');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold shadow-lg"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {index + 1}
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-500 bg-opacity-75 text-white px-2 py-1 rounded text-xs max-w-32 truncate">
                      {url.includes('apple.com') ? 'Apple Store' : url.includes('http') ? 'External' : 'Local'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No images available for this product
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center space-x-2">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={product?.isFeatured || false}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>Is Featured</span>
            </label>

            <label className="inline-flex items-center space-x-2">
              <input
                id="isNewArrival"
                name="isNewArrival"
                type="checkbox"
                checked={product?.isNewArrival || false}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>Is New Arrival</span>
            </label>
          </div>

          {/* Variants Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Product Variants
            </h2>
            {product?.variants?.map((variant: any, index: number) => (
              <div
                key={variant._id || index}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h3 className="font-semibold text-gray-700 mb-4">
                  Variant {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "color", placeholder: "Color" },
                    { name: "size", placeholder: "Size" },
                    { name: "price", type: "number", placeholder: "Price" },
                    { name: "stock", type: "number", placeholder: "Stock" },
                    { name: "sku", placeholder: "SKU" },
                    {
                      name: "images",
                      placeholder: "Image URLs (comma separated)",
                    },
                  ].map(({ name, placeholder, type = "text" }) => (
                    <input
                      key={name}
                      name={name}
                      type={type}
                      value={
                        name === "images"
                          ? variant[name]?.join(", ")
                          : variant[name]
                      }
                      onChange={(e) => handleArrayChange(e, index)}
                      placeholder={placeholder}
                      className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default function ProtectedEditProductPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <EditProductPage />
    </WithAuth>
  );
}