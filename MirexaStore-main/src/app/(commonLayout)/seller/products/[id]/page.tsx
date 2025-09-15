"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import WithAuth from "@/app/lib/utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `https://api.mirexastore.com/api/product/details/${id}`
          );
          setProduct(response.data.data);
          setLoading(false);
        } catch (err) {
          setError("Error fetching product");
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct: any) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    p0?: string
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct: any) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[index] = { ...updatedVariants[index], [name]: value };
      return {
        ...prevProduct,
        variants: updatedVariants,
      };
    });
  };
  const token = useSelector((state: RootState) => state.auth.token);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Authentication token is missing");
      toast.error("Authentication token is missing!");
      return;
    }

    try {
      await axios.put(
        `https://api.mirexastore.com/api/product/${id}`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product updated successfully!");
      router.push("/seller/products");
    } catch (err) {
      setError("Error updating product");
      toast.error("Error updating product!");
      console.error(err);
    }
  };

  if (loading) return <Loading></Loading>;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Edit Product
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Info Fields */}
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

            {/* Description */}
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
            {/* slug */}
            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="slug"
              >
                Slug
              </label>
              <textarea
                id="slug"
                name="slug"
                value={product?.slug || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                rows={3}
              />
            </div>

            {/* Long Description */}
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
                      onChange={(e) => handleArrayChange(e, index, name)}
                      placeholder={placeholder}
                      className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
            >
              Save Changes
            </button>
          </div>
        </form>

        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <EditProductPage />
    </WithAuth>
  );
}
