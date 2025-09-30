"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/lib/utils/withAuth";
import { useParams, useRouter } from "next/navigation";
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
import { HexColorPicker } from "react-colorful";
import Image from "next/image";
import React from "react";
import DeliveryChargesForm from "@/app/(commonLayout)/components/ui/deliveryCharges";
import SkeletonCard from "@/app/dashboard/components/SkeletonCard";
import Skeleton from "react-loading-skeleton";

const generateSKU = (slug: string, color: string, size: string) =>
  `${slug}-${color}-${size}`;

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

interface ProductData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  materials: string;
  weight: number;
  warranty: string;
  sellerEmail: string;
  price: number;
  discountPercentage: number;
  finalPrice: number;
  stockQuantity: number;
  category: string;
  brand: string;
  videoUrl: string;
  type: "own" | "affiliate";
  affiliateLink?: string;
  sku: string;
  lowStockThreshold: number;
  returnPolicy: string;
  freeShipping: boolean;
  packingStandard: string;
  innerSlug: string;
  innerSubSlug: string;
  dimensions: string;
  notes: string;
}

interface Variant {
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  images: string[];
  innerSlug?: string;
  innerSubSlug?: string;
  baseprice?: number;
  discount?: number;
  finalprice?: number;
  description?: string;
  variantDescription?: string;
  weight?: number;
  specification?: Array<{key: string; value: string}>;
}

export type DeliveryCharge = {
  division: string;
  district: string;
  charge: number;
};

const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "campus-needs-upload");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dwg8d0bfp/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

const EditProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [slugEdited, setSlugEdited] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    materials: "",
    weight: 0,
    warranty: "",
    sellerEmail: "",
    price: 0,
    discountPercentage: 0,
    finalPrice: 0,
    stockQuantity: 0,
    category: "",
    brand: "",
    videoUrl: "",
    type: "own",
    sku: "",
    lowStockThreshold: 10,
    returnPolicy: "",
    freeShipping: false,
    packingStandard: "",
    innerSlug: "",
    innerSubSlug: "",
    dimensions: "",
    notes: "",
  });

  const [productImages, setProductImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([""]);
  const [specifications, setSpecifications] = useState<Array<{key: string; value: string}>>([{key: "", value: ""}]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [brandSlug, setBrandSlug] = useState("seller");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [availableSlugs, setAvailableSlugs] = useState<any[]>([]);
  const [availableSubSlugs, setAvailableSubSlugs] = useState<any[]>([]);
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [selectedSlugId, setSelectedSlugId] = useState("");
  const [selectedSubSlugId, setSelectedSubSlugId] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [deliveryCharges, setDeliveryCharges] = React.useState<DeliveryCharge[]>([]);
  const [defaultDeliveryCharge, setDefaultDeliveryCharge] = React.useState(0);

  const handleDeliveryChange = useCallback((
    charges: DeliveryCharge[],
    defaultCharge: number
  ) => {
    setDeliveryCharges(charges);
    setDefaultDeliveryCharge(defaultCharge);
  }, []);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/details/${id}`
      );
      const product = response.data.data;
      
      setProductData({
        name: product.name || "",
        slug: product.urlSlug || product.slug || "",
        description: product.description || "",
        longDescription: product.longDescription || "",
        materials: product.materials || "",
        weight: product.weight || 0,
        warranty: product.warranty || "",
        sellerEmail: product.sellerEmail || "",
        price: product.price || 0,
        discountPercentage: product.discountPercentage || 0,
        finalPrice: product.finalPrice || product.price || 0,
        stockQuantity: product.stockQuantity || 0,
        category: product.category || "",
        brand: product.brand || "",
        videoUrl: product.videoUrl || "",
        type: product.type || "own",
        affiliateLink: product.affiliateLink || "",
        sku: product.sku || "",
        lowStockThreshold: product.lowStockThreshold || 10,
        returnPolicy: product.returnPolicy || "",
        freeShipping: product.freeShipping || false,
        packingStandard: product.packingStandard || "",
        innerSlug: product.innerSlug || "",
        innerSubSlug: product.innerSubSlug || "",
        dimensions: product.dimensions || "",
        notes: product.notes || "",
      });
      
      setProductImages(Array.isArray(product.productImages) ? product.productImages : []);
      setTags(Array.isArray(product.tags) ? product.tags : product.tags ? [product.tags] : [""]);
      setSpecifications(Array.isArray(product.specifications) && product.specifications.length > 0 ? product.specifications : [{key: "", value: ""}]);
      setVariants(Array.isArray(product.variants) ? product.variants : []);
      setIsFeatured(!!product.isFeatured);
      setIsNewArrival(!!product.isNewArrival);
      setSelectedCategory(product.category || "");
      setSelectedSlugId(product.slug?._id || product.slug || "");
      setSelectedSubSlugId(product.subSlug?._id || product.subSlug || "");
      setDeliveryCharges(Array.isArray(product.deliveryCharges) ? product.deliveryCharges : []);
      setDefaultDeliveryCharge(product.defaultDeliveryCharge || 0);
      
    } catch (error) {
      toast.error("Error fetching product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchDynamicCategories = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const data = await res.json();
      setDynamicCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setDynamicCategories([]);
    }
  }, []);

  const fetchSlugs = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slug`);
      const data = await res.json();
      setAvailableSlugs(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setAvailableSlugs([]);
    }
  }, []);

  const fetchSubSlugs = useCallback(async (slugId: string) => {
    if (!slugId) {
      setAvailableSubSlugs([]);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subslug/parent/${slugId}`);
      const data = await res.json();
      setAvailableSubSlugs(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setAvailableSubSlugs([]);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`);
      const data = await res.json();
      setAvailableBrands(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setAvailableBrands([]);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchDynamicCategories();
    fetchSlugs();
    fetchBrands();
  }, [fetchProduct, fetchDynamicCategories, fetchSlugs, fetchBrands]);

  useEffect(() => {
    if (selectedSlugId) {
      fetchSubSlugs(selectedSlugId);
    }
  }, [selectedSlugId, fetchSubSlugs]);

  useEffect(() => {
    if (!slugEdited && productData.name) {
      setProductData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }
  }, [productData.name, slugEdited]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "slug") setSlugEdited(true);
    
    const newData = {
      ...productData,
      [name]: type === "number" ? Number(value) : value,
    };
    
    if (name === "price" || name === "discountPercentage") {
      const price = name === "price" ? Number(value) : newData.price;
      const discountPercentage = name === "discountPercentage" ? Number(value) : newData.discountPercentage;
      newData.finalPrice = price - (price * discountPercentage / 100);
    }
    
    setProductData(newData);
  }, [productData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData.name.trim()) {
      toast.error("❌ Product name is required.");
      return;
    }

    const finalCategory = selectedCategory === "Others" ? customCategory.trim() : selectedCategory;
    if (!finalCategory) {
      toast.error("❌ Please select or enter a category.");
      return;
    }

    const finalData = {
      ...productData,
      urlSlug: productData.slug,
      slug: selectedSlugId || undefined,
      subSlug: selectedSubSlugId || undefined,
      category: finalCategory,
      type: productData.affiliateLink ? "affiliate" : "own",
      productImages,
      tags: tags.filter(tag => tag.trim() !== ""),
      specifications: specifications.filter(spec => spec.key.trim() !== "" && spec.value.trim() !== ""),
      isFeatured,
      isNewArrival,
      variants: variants.map(variant => ({
        ...variant,
        sku: variant.sku || generateSKU(productData.slug, variant.color, variant.size),
        specification: variant.specification?.filter(spec => spec.key.trim() !== "" && spec.value.trim() !== "") || []
      })),
      deliveryCharges: deliveryCharges.filter(charge => charge.division && charge.district),
      defaultDeliveryCharge,
      discountPercentage: productData.discountPercentage,
      finalPrice: productData.finalPrice
    };

    const updatingToast = toast.loading("🔄 Updating product...");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.dismiss(updatingToast);
        toast.success("✅ Product updated successfully!", {
          onClose: () => router.push("/dashboard/seller/products")
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      toast.dismiss(updatingToast);
      console.error("Error updating product:", err);
      if (err.response && err.response.status === 400) {
        toast.error(
          `❌ ${err.response.data.message || "Bad Request - Check console for details"}`
        );
      } else {
        toast.error("❌ Failed to update product.");
      }
    }
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const uploadingToast = toast.loading(`📤 Uploading ${files.length} image(s)...`);
    try {
      const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setProductImages((prev) => [...prev, ...uploadedUrls]);
      toast.dismiss(uploadingToast);
      toast.success(`✅ ${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.dismiss(uploadingToast);
      toast.error("❌ Image upload failed!");
    }
  }, []);

  const renderInputField = (
    label: string,
    name: keyof ProductData,
    type = "text",
    Icon?: LucideIcon,
    iconColor = "#F39C12",
    required = false
  ) => {
    const isMultiline = name === "description" || name === "longDescription";

    return (
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-navy-blue mb-1 flex items-center gap-1">
          {label}
          {required && <span className="text-accent-orange">*</span>}
        </label>

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-gray">
              <Icon className="w-5 h-5" color={iconColor} />
            </div>
          )}

          {isMultiline ? (
            <textarea
              name={name}
              required={required}
              value={productData[name] as string}
              onChange={handleInputChange}
              rows={name === "description" ? 2 : 3}
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm text-sm text-navy-blue bg-white focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 hover:border-steel-gray ${
                Icon ? "pl-11" : ""
              }`}
            />
          ) : (
            <input
              type={type}
              name={name}
              required={required}
              value={productData[name] === 0 ? "" : String(productData[name])}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm text-sm text-navy-blue bg-white focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 hover:border-steel-gray ${
                Icon ? "pl-11" : ""
              }`}
            />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-navy-blue mb-10">
          Loading Product...
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-navy-blue mb-2">
                Edit Product
              </h1>
              <p className="text-steel-gray">
                Update your product details below
              </p>
            </div>

            {/* Basic Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent-orange" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputField("Product Name", "name", "text", Tag, "#F39C12", true)}
                {renderInputField("Slug (Editable)", "slug", "text", Sliders, "#F39C12", true)}
              </div>
              <div className="mt-6">
                {renderInputField("Description", "description", "text", FileText, "#F39C12", true)}
              </div>
              <div className="mt-6">
                {renderInputField("Long Description", "longDescription", "text", FileText, "#F39C12")}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-accent-orange" />
                Product Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderInputField("Materials", "materials", "text", Box, "#F39C12")}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-navy-blue mb-1 flex items-center gap-1">
                    Weight (grams)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-gray">
                      <Weight className="w-5 h-5" color="#F39C12" />
                    </div>
                    <input
                      type="number"
                      name="weight"
                      value={productData.weight === 0 ? "" : productData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg shadow-sm text-sm text-navy-blue bg-white focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 hover:border-steel-gray"
                    />
                  </div>
                </div>
                {renderInputField("Warranty", "warranty", "text", Shield, "#F39C12")}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent-orange" />
                Pricing & Stock
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {renderInputField("Price", "price", "number", DollarSign, "#F39C12", true)}
                {renderInputField("Discount %", "discountPercentage", "number", Percent, "#F39C12")}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-navy-blue mb-1">Final Price</label>
                  <input
                    type="number"
                    value={productData.finalPrice || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-navy-blue"
                  />
                </div>
                {renderInputField("Stock Quantity", "stockQuantity", "number", Layers, "#F39C12", true)}
              </div>
            </div>

            {/* Category Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6">Category & Brand</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-navy-blue mb-2">Category *</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-navy-blue"
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
                </div>

                {selectedCategory === "Others" && (
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-navy-blue"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-navy-blue mb-2">Brand</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-navy-blue"
                      value={productData.brand}
                      onChange={(e) => setProductData(prev => ({...prev, brand: e.target.value}))}
                    >
                      <option value="">Select a brand</option>
                      {availableBrands.map((brand) => (
                        <option key={brand._id || brand.slug} value={brand.name}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {renderInputField("Video URL", "videoUrl", "text", Video, "#F39C12")}
                </div>
              </div>
            </div>

            {/* Advanced Settings Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-orange" />
                Advanced Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputField("SKU", "sku", "text", Package, "#F39C12")}
                {renderInputField("Low Stock Alert", "lowStockThreshold", "number", Archive, "#F39C12")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {renderInputField("Return Policy", "returnPolicy", "text", Shield, "#F39C12")}
                {renderInputField("Dimensions", "dimensions", "text", Box, "#F39C12")}
                {renderInputField("Packing Standard", "packingStandard", "text", Package, "#F39C12")}
              </div>
              
              {/* Slug Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="font-semibold text-navy-blue mb-2 flex items-center gap-1">
                    Slug
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                    value={selectedSlugId}
                    onChange={(e) => {
                      setSelectedSlugId(e.target.value);
                      setSelectedSubSlugId("");
                    }}
                  >
                    <option value="">Select Slug</option>
                    {availableSlugs.map((slug) => (
                      <option key={slug._id} value={slug._id}>
                        {slug.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-navy-blue mb-2 flex items-center gap-1">
                    Sub Slug
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                    value={selectedSubSlugId}
                    onChange={(e) => setSelectedSubSlugId(e.target.value)}
                    disabled={!selectedSlugId}
                  >
                    <option value="">Select Sub Slug</option>
                    {availableSubSlugs.map((subslug) => (
                      <option key={subslug._id} value={subslug._id}>
                        {subslug.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                {renderInputField("Notes", "notes", "text", FileText, "#F39C12")}
              </div>
            </div>

            {/* Media & Content Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent-orange" />
                Media & Content
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="font-semibold text-navy-blue mb-2 flex items-center gap-1">
                    Product Images ({productImages.length})
                    <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                  />
                  {productImages.length > 0 ? (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {productImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <Image
                            src={img}
                            alt={`Product ${idx + 1}`}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = productImages.filter((_, i) => i !== idx);
                              setProductImages(newImages);
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg mt-4">
                      No images available. Please upload product images.
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-navy-blue mb-2">Tags</label>
                  {tags.map((tag, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-3">
                      <input
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...tags];
                          newTags[idx] = e.target.value;
                          setTags(newTags);
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                        placeholder="Enter tag"
                      />
                      <button
                        type="button"
                        onClick={() => setTags(prev => prev.filter((_, i) => i !== idx))}
                        className="bg-accent-orange hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTags(prev => [...prev, ""])}
                    className="bg-steel-gray hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-navy-blue">Specifications</h2>
                <button
                  type="button"
                  onClick={() => setSpecifications(prev => [...prev, { key: "", value: "" }])}
                  className="bg-steel-gray hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Add Specification
                </button>
              </div>
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...specifications];
                      newSpecs[index].key = e.target.value;
                      setSpecifications(newSpecs);
                    }}
                    className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-navy-blue"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...specifications];
                      newSpecs[index].value = e.target.value;
                      setSpecifications(newSpecs);
                    }}
                    className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-navy-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setSpecifications(prev => prev.filter((_, i) => i !== index))}
                    className="bg-accent-orange hover:bg-orange-600 text-white px-3 py-2 rounded-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Product Options */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6">Product Options</h2>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 text-navy-blue font-medium">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-accent-orange bg-white border-gray-300 rounded"
                  />
                  Featured Product
                </label>
                <label className="flex items-center gap-3 text-navy-blue font-medium">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 text-accent-orange bg-white border-gray-300 rounded"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-3 text-navy-blue font-medium">
                  <input
                    type="checkbox"
                    checked={productData.freeShipping}
                    onChange={(e) => setProductData(prev => ({...prev, freeShipping: e.target.checked}))}
                    className="w-4 h-4 text-accent-orange bg-white border-gray-300 rounded"
                  />
                  Free Shipping
                </label>
              </div>
            </div>

            {/* Product Variants Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-navy-blue mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent-orange" />
                  Product Variants
                </h2>
                <p className="text-steel-gray">
                  Manage product variants with different colors, sizes, and prices.
                </p>
              </div>
              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-xl text-navy-blue flex items-center gap-2">
                        <Package className="w-5 h-5 text-accent-orange" />
                        Variant {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setVariants(prev => prev.filter((_, i) => i !== index))}
                        className="bg-accent-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    
                    {/* Basic Variant Info */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h5 className="font-semibold text-navy-blue mb-4 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-accent-orange" />
                        Basic Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">SKU</label>
                          <input
                            type="text"
                            placeholder="SKU"
                            value={variant.sku || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].sku = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Size</label>
                          <input
                            type="text"
                            placeholder="Size (e.g., M, L, XL)"
                            value={variant.size || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].size = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Selection */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h5 className="font-semibold text-navy-blue mb-4 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-accent-orange"></div>
                        Color Selection
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <HexColorPicker
                            color={variant.color || "#ff0000"}
                            onChange={(color) => {
                              const newVariants = [...variants];
                              newVariants[index].color = color;
                              setVariants(newVariants);
                            }}
                            className="w-full rounded-lg shadow-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className="block text-sm font-medium text-navy-blue mb-2">Color Code</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={variant.color || ""}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[index].color = e.target.value;
                                  setVariants(newVariants);
                                }}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                                placeholder="#ffffff"
                              />
                              <div
                                className="w-12 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                                style={{ backgroundColor: variant.color || "#ffffff" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Slug Configuration */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h5 className="font-semibold text-navy-blue mb-4 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-accent-orange" />
                        Slug Configuration
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Inner Slug</label>
                          <select
                            value={variant.innerSlug || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].innerSlug = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          >
                            <option value="">Select Inner Slug</option>
                            {selectedSlugId && availableSlugs.find(s => s._id === selectedSlugId)?.innerSlugs?.map((innerSlug: string, idx: number) => (
                              <option key={idx} value={innerSlug}>
                                {innerSlug}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Inner Sub Slug</label>
                          <select
                            value={variant.innerSubSlug || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].innerSubSlug = e.target.value;
                              setVariants(newVariants);
                            }}
                            disabled={!selectedSubSlugId}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200 disabled:bg-gray-100"
                          >
                            <option value="">Select Inner Sub Slug</option>
                            {selectedSubSlugId && availableSubSlugs.find(s => s._id === selectedSubSlugId)?.innerSubSlugs?.map((innerSubSlug: string, idx: number) => (
                              <option key={idx} value={innerSubSlug}>
                                {innerSubSlug}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pricing & Stock */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h5 className="font-semibold text-navy-blue mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-accent-orange" />
                        Pricing & Stock
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Stock Quantity</label>
                          <input
                            type="number"
                            placeholder="Stock"
                            value={variant.stock || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].stock = Number(e.target.value);
                              setVariants(newVariants);
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Base Price</label>
                          <input
                            type="number"
                            placeholder="Base Price"
                            value={variant.baseprice || variant.price || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              const basePrice = Number(e.target.value);
                              newVariants[index].baseprice = basePrice;
                              newVariants[index].price = basePrice;
                              const discount = newVariants[index].discount || 0;
                              newVariants[index].finalprice = basePrice - (basePrice * discount / 100);
                              setVariants(newVariants);
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Discount %</label>
                          <input
                            type="number"
                            placeholder="Discount %"
                            value={variant.discount || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              const discount = Number(e.target.value);
                              newVariants[index].discount = discount;
                              const basePrice = newVariants[index].baseprice || newVariants[index].price || 0;
                              newVariants[index].finalprice = basePrice - (basePrice * discount / 100);
                              setVariants(newVariants);
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Final Price</label>
                          <input
                            type="number"
                            placeholder="Final Price"
                            value={variant.finalprice || variant.price || ''}
                            readOnly
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-navy-blue focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Physical Properties */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h5 className="font-semibold text-navy-blue mb-4 flex items-center gap-2">
                        <Weight className="w-4 h-4 text-accent-orange" />
                        Physical Properties
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Weight (grams)</label>
                          <input
                            type="number"
                            placeholder="Weight (grams)"
                            value={variant.weight || ''}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].weight = Number(e.target.value);
                              setVariants(newVariants);
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-blue mb-2">Variant Images</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;
                              
                              const uploadingToast = toast.loading(`📤 Uploading ${files.length} variant image(s)...`);
                              try {
                                const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
                                const uploadedUrls = await Promise.all(uploadPromises);
                                const newVariants = [...variants];
                                newVariants[index].images = [...(variant.images || []), ...uploadedUrls];
                                setVariants(newVariants);
                                toast.dismiss(uploadingToast);
                                toast.success(`✅ ${files.length} variant image(s) uploaded!`);
                              } catch (error) {
                                toast.dismiss(uploadingToast);
                                toast.error("❌ Variant image upload failed!");
                              }
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                          />
                          {variant.images && variant.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {variant.images.map((img, imgIdx) => (
                                <div key={imgIdx} className="relative">
                                  <Image
                                    src={img}
                                    alt={`Variant ${index + 1} Image ${imgIdx + 1}`}
                                    width={60}
                                    height={60}
                                    className="w-15 h-15 object-cover rounded border"
                                    unoptimized
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newVariants = [...variants];
                                      newVariants[index].images = variant.images?.filter((_, i) => i !== imgIdx) || [];
                                      setVariants(newVariants);
                                    }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h5 className="font-semibold text-navy-blue mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent-orange" />
                        Description
                      </h5>
                      <textarea
                        placeholder="Variant Description"
                        value={variant.variantDescription || variant.description || ''}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].variantDescription = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                        rows={3}
                      />
                    </div>
                    
                    {/* Variant Specifications */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-semibold text-navy-blue flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-accent-orange" />
                          Variant Specifications
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            const newVariants = [...variants];
                            if (!newVariants[index].specification) {
                              newVariants[index].specification = [];
                            }
                            newVariants[index].specification!.push({ key: "", value: "" });
                            setVariants(newVariants);
                          }}
                          className="bg-steel-gray hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                        >
                          Add Spec
                        </button>
                      </div>
                      <div className="space-y-3">
                        {variant.specification?.map((spec, specIndex) => (
                          <div key={specIndex} className="flex gap-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Key (e.g., Material)"
                                value={spec.key}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[index].specification![specIndex].key = e.target.value;
                                  setVariants(newVariants);
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Value (e.g., Cotton)"
                                value={spec.value}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[index].specification![specIndex].value = e.target.value;
                                  setVariants(newVariants);
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newVariants = [...variants];
                                newVariants[index].specification!.splice(specIndex, 1);
                                setVariants(newVariants);
                              }}
                              className="bg-accent-orange hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    const newVariant: Variant = {
                      sku: generateSKU(productData.slug || 'product', '#000000', 'default'),
                      color: "#000000",
                      size: "",
                      stock: 0,
                      price: productData.price || 0,
                      images: [],
                      innerSlug: "",
                      innerSubSlug: "",
                      baseprice: productData.price || 0,
                      discount: 0,
                      finalprice: productData.price || 0,
                      description: "",
                      variantDescription: "",
                      weight: 0,
                      specification: [{ key: "", value: "" }]
                    };
                    setVariants(prev => [...prev, newVariant]);
                  }}
                  className="w-full bg-navy-blue hover:bg-blue-800 text-white py-4 rounded-lg transition-colors duration-200 font-semibold text-lg shadow-sm"
                >
                  + Add New Variant
                </button>
              </div>
            </div>

            {/* Delivery Charges */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6">Delivery Settings</h2>
              <DeliveryChargesForm
                initialDeliveryCharges={deliveryCharges}
                initialDefaultCharge={defaultDeliveryCharge}
                onChange={handleDeliveryChange}
              />
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-accent-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg transition-colors duration-200 font-semibold text-lg shadow-sm flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default function ProtectedEditProductPage() {
  return (
    <WithAuth requiredRoles={["seller"]}>
      <EditProduct />
    </WithAuth>
  );
}