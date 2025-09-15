"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/app/lib/utils/withAuth";

// ✅ SKU generator
const generateSKU = (slug: string, color: string, size: string) =>
  `${slug}-${color}-${size}`;

// ✅ Slug generator from name
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

// ✅ Interfaces
interface ProductData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  materials: string;
  careInstructions: string;
  specifications: string;
  additionalInfo: string;
  weight: number;
  warranty: string;
  sellerEmail: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  category: string;
  brand: string;
  videoUrl: string;
}

interface Variant {
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  images: string[];
}

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false); // Track if slug was edited manually
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    materials: "",
    careInstructions: "",
    specifications: "",
    additionalInfo: "",
    weight: 0,
    warranty: "",
    sellerEmail: "",
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    category: "",
    brand: "",
    videoUrl: "",
  });

  const [productImages, setProductImages] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);
  const [colors, setColors] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // ✅ Auto-generate slug when name changes (unless manually edited)
  useEffect(() => {
    if (!slugEdited) {
      setProductData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }
  }, [productData.name, slugEdited]);

  // ✅ Input Change Handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "slug") setSlugEdited(true); // User manually edited slug

    setProductData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // ✅ Array Handlers
  const handleArrayChange = (setter: any, index: number, value: string) => {
    setter((prev: string[]) =>
      prev.map((item, idx) => (idx === index ? value : item))
    );
  };
  const addArrayItem = (setter: any) =>
    setter((prev: string[]) => [...prev, ""]);
  const removeArrayItem = (setter: any, index: number) =>
    setter((prev: string[]) => prev.filter((_, idx) => idx !== index));

  // ✅ Variant Handling
  const handleVariantChange = (color: string, size: string) => {
    const sku = generateSKU(productData.slug, color, size);
    if (!variants.some((v) => v.color === color && v.size === size)) {
      setVariants((prev) => [
        ...prev,
        { sku, color, size, stock: 0, price: productData.price, images: [] },
      ]);
    }
  };

  const updateVariantField = (
    color: string,
    size: string,
    field: keyof Variant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.color === color && variant.size === size
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  // ✅ Form Reset
  const resetForm = () => {
    setProductData({
      name: "",
      slug: "",
      description: "",
      longDescription: "",
      materials: "",
      careInstructions: "",
      specifications: "",
      additionalInfo: "",
      weight: 0,
      warranty: "",

      sellerEmail: "",
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      category: "",
      brand: "",
      videoUrl: "",
    });
    setProductImages([""]);
    setTags([""]);
    setColors([""]);
    setSizes([""]);
    setFeatures([""]);
    setVariants([]);
    setIsFeatured(false);
    setIsNewArrival(false);
    setSlugEdited(false);
  };
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  // ✅ Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sellerEmail = user?.email || "";
    const sellerName = user?.name || "";

    const finalData = {
      ...productData,
      productImages,
      tags,
      colors,
      sizes,
      features,
      isFeatured,
      isNewArrival,
      variants,
      sellerEmail,
      sellerName,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check the response status and handle success
      if (response.status === 200) {
        toast.success("✅ Product added successfully!");
        resetForm();
      } else {
        throw new Error("Failed to add product.");
      }
    } catch (err) {
      console.error("Error adding product:", err); // Log the error to help debug
      toast.error("❌ Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render Fields
  const renderInputField = (
    label: string,
    name: keyof ProductData,
    type = "text"
  ) => (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={productData[name] === 0 ? "" : productData[name]}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderArrayField = (label: string, state: string[], setter: any) => (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700">{label}</label>
      {state.map((val, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            value={val}
            onChange={(e) => handleArrayChange(setter, idx, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeArrayItem(setter, idx)}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(setter)}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
      >
        Add {label}
      </button>
    </div>
  );

  // ✅ Variants Render
  const renderVariants = () =>
    colors.flatMap((color) =>
      sizes.map((size) => (
        <div
          key={`${color}-${size}`}
          className="border p-6 my-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
        >
          <h4 className="font-bold text-xl">
            {color} - {size}
          </h4>
          <div className="flex gap-4 items-center">
            <input
              value={generateSKU(productData.slug, color, size)}
              disabled
              className="p-3 border border-gray-300 rounded-md w-full"
            />
            <button
              type="button"
              onClick={() => handleVariantChange(color, size)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
            >
              Add Variant
            </button>
          </div>
          {variants.some((v) => v.color === color && v.size === size) && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Stock"
                onChange={(e) =>
                  updateVariantField(
                    color,
                    size,
                    "stock",
                    Number(e.target.value)
                  )
                }
                className="p-3 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Price"
                onChange={(e) =>
                  updateVariantField(
                    color,
                    size,
                    "price",
                    Number(e.target.value)
                  )
                }
                className="p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Images (comma separated)"
                onChange={(e) =>
                  updateVariantField(
                    color,
                    size,
                    "images",
                    e.target.value.split(",")
                  )
                }
                className="p-3 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>
      ))
    );

  // ✅ Return Form
  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <ToastContainer />
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center text-2xl font-semibold text-gray-800">
          Add Product
        </div>
        {renderInputField("Product Name", "name")}
        {renderInputField("Slug (Editable)", "slug")}
        {renderInputField("Description", "description")}
        {renderInputField("Long Description", "longDescription")}
        {renderInputField("Materials", "materials")}
        {renderInputField("Care Instructions", "careInstructions")}
        {renderInputField("Specifications", "specifications")}
        {renderInputField("Additional Info", "additionalInfo")}
        {renderInputField("Weight", "weight", "number")}
        {renderInputField("Warranty", "warranty")}

        {renderInputField("Price", "price")}
        {renderInputField("Discount Price", "discountPrice", "number")}
        {renderInputField("Stock Quantity", "stockQuantity", "number")}
        {renderInputField("Category", "category")}
        {renderInputField("Brand", "brand")}
        {renderInputField("Video URL", "videoUrl")}

        {renderArrayField("Product Images", productImages, setProductImages)}
        {renderArrayField("Tags", tags, setTags)}
        {renderArrayField("Colors", colors, setColors)}
        {renderArrayField("Sizes", sizes, setSizes)}
        {renderArrayField("Features", features, setFeatures)}

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
            />
            New Arrival
          </label>
        </div>

        <h3 className="text-lg font-semibold mt-6 text-gray-800">
          Variants (Color + Size)
        </h3>
        {renderVariants()}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <AddProduct />
    </WithAuth>
  );
}
