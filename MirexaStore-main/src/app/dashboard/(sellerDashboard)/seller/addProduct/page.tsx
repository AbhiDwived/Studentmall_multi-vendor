"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/app/lib/utils/withAuth";
import { HexColorPicker } from "react-colorful";
import {
  Package,
  Tag,
  Image as ImageIcon,
  Layers,
  Link2,
  DollarSign,
  LucideIcon,
  Weight,
  Shield,
  Info,
  Archive,
  Video,
  Link,
  FileText,
  Box,
  Sliders,
  Percent,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import DeliveryChargesForm from "@/app/(commonLayout)/components/ui/deliveryCharges";
import SkeletonCard from "@/app/dashboard/components/SkeletonCard";
import Skeleton from "react-loading-skeleton";

// SKU generator
const generateSKU = (slug: string, color: string, size: string) =>
  `${slug}-${color}-${size}`;

// Slug generator
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

// Interfaces
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
  type: "own" | "affiliate";
  affiliateLink?: string;
}

interface Variant {
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  images: string[];
}

export type DeliveryCharge = {
  division: string;
  district: string;
  charge: number;
};

// 🌟 Cloudinary Upload Function
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "campus-needs-upload"); // ✅ Your upload preset

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dwg8d0bfp/image/upload`, // ✅ Your cloud name in URL
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url; // eta hocche upload hoye jawa image er URL
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
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
    type: "own",
  });

  const [productImages, setProductImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([""]);
  const [colors, setColors] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [brandSlug, setBrandSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [deliveryCharges, setDeliveryCharges] = React.useState<
    DeliveryCharge[]
  >([]);
  const [defaultDeliveryCharge, setDefaultDeliveryCharge] = React.useState(0);

  const handleDeliveryChange = (
    charges: DeliveryCharge[],
    defaultCharge: number
  ) => {
    setDeliveryCharges(charges);
    setDefaultDeliveryCharge(defaultCharge);
  };
  //colour select

  const addColor = () => {
    if (currentColor && !colors.includes(currentColor)) {
      setColors([...colors, currentColor]);
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };
  const fetchDynamicCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const data = await res.json();
      setDynamicCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load categories", error);
      setDynamicCategories([]);
    }
  };

  useEffect(() => {
    const fetchBrandSlug = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${user?.email}`
        );
        console.log("data", data);
        setBrandSlug(data?.data?.brand?.slug); // set the brand slug
        console.log("Brand Slug:", data?.data?.brand?.slug);
      } catch (error) {
        console.error("Failed to fetch brand slug:", error);
      }
    };

    if (user?.email) {
      fetchBrandSlug();
    }
    
    // Fetch dynamic categories
    fetchDynamicCategories();
  }, [user?.email]);

  useEffect(() => {
    if (!slugEdited) {
      setProductData((prev) => ({
        ...prev,
        slug: `${brandSlug}-${generateSlug(prev.name)}`,
      }));
    }
  }, [brandSlug, productData.name, slugEdited]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "slug") setSlugEdited(true);
    setProductData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleArrayChange = (setter: any, index: number, value: string) => {
    setter((prev: string[]) =>
      prev.map((item, idx) => (idx === index ? value : item))
    );
  };

  const addArrayItem = (setter: any) =>
    setter((prev: string[]) => [...prev, ""]);

  const removeArrayItem = (setter: any, index: number) =>
    setter((prev: string[]) => prev.filter((_, idx) => idx !== index));

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
      type: "own",
    });
    setProductImages([]);
    setTags([""]);
    setColors([""]);
    setSizes([""]);
    setFeatures([""]);
    setVariants([]);
    setIsFeatured(false);
    setIsNewArrival(false);
    setSlugEdited(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Category
    const finalCategory =
      selectedCategory === "Others" ? customCategory.trim() : selectedCategory;

    if (!finalCategory) {
      toast.error("❌ Please select or enter a category.");
      return;
    }

    const sellerEmail = user?.email || "";
    const sellerName = user?.name || "";
    const sellerNumber = user?.phone || 0;

    const finalData = {
      ...productData,
      category: finalCategory, // Add the final category here
      type: productData.affiliateLink ? "affiliate" : "own",
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
      sellerNumber,
      deliveryCharges,
      defaultDeliveryCharge,
    };

    setLoading(true);

    try {
      console.log("data", finalData);
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
      if (response.status === 200) {
        toast.success("✅ Product added successfully!");
        resetForm();
        // Reset Category States
        setSelectedCategory("");
        setCustomCategory("");
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      console.error("Error adding product:", err);
      if (err.response && err.response.status === 400) {
        toast.error(
          `❌ ${err.response.data.message || "Slug already exists."}`
        );
      } else {
        toast.error("❌ Failed to add product.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Updated Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLoading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setProductImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("✅ Images uploaded!");
    } catch (error) {
      toast.error("❌ Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    name: keyof ProductData,
    type = "text",
    Icon?: LucideIcon,
    iconColor = "#F6550C",
    required = false
  ) => {
    const isMultiline = name === "description" || name === "longDescription";

    return (
      <div className="flex flex-col gap-1">
        {/* Label with asterisk if required */}
        <label className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" color={iconColor} />
            </div>
          )}

          {isMultiline ? (
            <textarea
              name={name}
              required={required}
              value={productData[name] as string}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 ${
                Icon ? "pl-11" : ""
              }`}
            />
          ) : (
            <input
              type={type}
              name={name}
              required={required}
              value={productData[name] === 0 ? "" : productData[name]}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 ${
                Icon ? "pl-11" : ""
              }`}
            />
          )}
        </div>
      </div>
    );
  };

  const renderArrayField = (
    label: string,
    state: string[],
    setter: any,
    required = false
  ) => (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {label === "Product Images" ? (
        <>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-300 rounded-md"
            required={required}
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {state.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt="Uploaded Preview"
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-md border"
                unoptimized
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {state.map((val, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                value={val}
                onChange={(e) => handleArrayChange(setter, idx, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={required}
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
        </>
      )}
    </div>
  );

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

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <ToastContainer />
      {loading && (
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
            Seller Analytics Dashboard
          </h1>

          {/* Skeleton for summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Skeleton for charts and tables */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
            <div className="mb-4">
              <Skeleton style={{ height: 32, width: 200 }} />
            </div>
            <Skeleton style={{ height: 200 }} />
          </div>

          <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
            <div className="mb-4">
              <Skeleton style={{ height: 32, width: 250 }} />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} style={{ height: 24 }} className="mb-2" />
            ))}
          </div>

          <div className="mt-10 bg-white p-6 rounded-xl shadow-md border">
            <div className="mb-4">
              <Skeleton style={{ height: 32, width: 250 }} />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} style={{ height: 24 }} className="mb-2" />
            ))}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center text-2xl font-semibold text-gray-800">
          Add Product
        </div>
        {renderInputField("Product Name", "name", "text", Tag, "#F6550C", true)}
        {renderInputField(
          "Slug (Editable)",
          "slug",
          "text",
          Sliders,
          "#F6550C",
          true
        )}
        {renderInputField(
          "Description",
          "description",
          "text",
          FileText,
          "#F6550C",
          true
        )}
        {renderInputField(
          "Long Description",
          "longDescription",
          "text",
          FileText,
          "#F6550C"
        )}
        {renderInputField("Materials", "materials", "text", Box, "#F6550C")}
        {renderInputField(
          "Care Instructions",
          "careInstructions",
          "text",
          Info,
          "#F6550C"
        )}
        {renderInputField(
          "Specifications",
          "specifications",
          "text",
          Layers,
          "#F6550C"
        )}
        {renderInputField(
          "Additional Info",
          "additionalInfo",
          "text",
          Info,
          "#F6550C"
        )}
        {renderInputField("Weight", "weight", "number", Weight, "#F6550C")}
        {renderInputField("Warranty", "warranty", "text", Shield, "#F6550C")}
        {renderInputField(
          "Price",
          "price",
          "number",
          DollarSign,
          "#F6550C",
          true
        )}
        {renderInputField(
          "After Discount Price",
          "discountPrice",
          "number",
          DollarSign,
          "#F6550C",
          true
        )}
        {renderInputField(
          "Stock Quantity",
          "stockQuantity",
          "number",
          Layers,
          "#F6550C",
          true
        )}
        <label
          className="block text-base font-medium mb-1"
          style={{ color: "#F6550C" }}
        >
          Category<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {dynamicCategories.map((category) => (
            <option key={category._id || category.slug} value={category.name}>
              {category.name}
            </option>
          ))}
          <option value="Others">Others</option>
        </select>

        {selectedCategory === "Others" && (
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        {renderInputField("Brand", "brand", "text", Tag, "#F6550C")}
        {renderInputField("Video URL", "videoUrl", "text", Video, "#F6550C")}
        {renderArrayField(
          "Product Images",
          productImages,
          setProductImages,
          true
        )}
        {renderArrayField("Tags", tags, setTags)}
        {/* colour picker */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-800 mb-2">
            Pick Product Colors
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Color Picker */}
            <div>
              <HexColorPicker
                color={currentColor}
                onChange={setCurrentColor}
                className="w-full rounded-lg shadow"
              />
            </div>

            {/* Manual Input + Preview + Add */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
                  placeholder="#ffffff"
                />
                <div
                  className="w-8 h-8 rounded-full border shadow"
                  style={{ backgroundColor: currentColor }}
                ></div>
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  + Add
                </button>
              </div>

              {/* Selected Color List */}
              {colors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <div
                        key={color}
                        onClick={() => removeColor(color)}
                        className="w-7 h-7 rounded-full border shadow cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={`Click to remove ${color}`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderArrayField("Sizes", sizes, setSizes)}
        {renderArrayField("Features", features, setFeatures)}
        {renderInputField(
          "Affiliate Link (এই ঘরটি শুধু তখনই পূরণ করুন যদি প্রোডাক্টটি affiliate টাইপের হয়। না হলে ফাঁকা রাখুন।)",
          "affiliateLink",
          "text",
          Link,
          "#F6550C",
          false
        )}

        {/* checkboxes and variants remain the same */}
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
        <DeliveryChargesForm
          initialDeliveryCharges={deliveryCharges}
          initialDefaultCharge={defaultDeliveryCharge}
          onChange={handleDeliveryChange}
        />
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
    <WithAuth requiredRoles={["seller"]}>
      <AddProduct />
    </WithAuth>
  );
}
