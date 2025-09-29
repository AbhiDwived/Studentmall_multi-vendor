"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/lib/utils/withAuth";

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
  // Enhanced fields
  sku: string;
  lowStockThreshold: number;
  returnPolicy: string;
  freeShipping: boolean;
  packingStandard: string;
  // New model fields
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
  // Enhanced variant fields from backend model
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
    return data.secure_url; // This is the URL of the uploaded image
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
    // Enhanced fields
    sku: "",
    lowStockThreshold: 10,
    returnPolicy: "",
    freeShipping: false,
    packingStandard: "",
    // New model fields
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
  const [deliveryCharges, setDeliveryCharges] = React.useState<
    DeliveryCharge[]
  >([]);
  const [defaultDeliveryCharge, setDefaultDeliveryCharge] = React.useState(0);

  const handleDeliveryChange = useCallback((
    charges: DeliveryCharge[],
    defaultCharge: number
  ) => {
    setDeliveryCharges(charges);
    setDefaultDeliveryCharge(defaultCharge);
  }, []);
  const addVariant = useCallback(() => {
    const newVariant: Variant = {
      sku: generateSKU(productData.slug || 'product', '#000000', 'default'),
      color: "#000000",
      size: "",
      stock: 0,
      price: productData.price || 0,
      images: [],
      baseprice: productData.price || 0,
      discount: 0,
      finalprice: productData.price || 0,
      description: "",
      variantDescription: "",
      weight: 0,
      specification: [{ key: "", value: "" }]
    };
    setVariants(prev => [...prev, newVariant]);
  }, [productData.slug, productData.price]);

  const removeVariant = useCallback((index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  }, []);
  const fetchDynamicCategories = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
      const data = await res.json();
      setDynamicCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load categories", error);
      setDynamicCategories([]);
    }
  }, []);

  const fetchSlugs = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slug`);
      const data = await res.json();
      setAvailableSlugs(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load slugs", error);
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
      console.error("Failed to load subslugs", error);
      setAvailableSubSlugs([]);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`);
      const data = await res.json();
      setAvailableBrands(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to load brands", error);
      setAvailableBrands([]);
    }
  }, []);



  const fetchBrandSlug = useCallback(async () => {
    if (!user?.email || user.role !== 'seller') {
      setBrandSlug('seller');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/profile/${user.email}`,
        { 
          validateStatus: (status) => status < 500,
          timeout: 5000
        }
      );
      
      if (response.status === 200 && response.data?.success) {
        setBrandSlug(response.data.data?.brand?.slug || 'seller');
      } else {
        setBrandSlug('seller');
      }
    } catch (error: any) {
      setBrandSlug('seller');
      if (error.response?.status >= 500) {
        console.error('Server error fetching seller profile:', error);
      }
    }
  }, [user?.email, user?.role]);

  useEffect(() => {
    fetchBrandSlug();
    fetchDynamicCategories();
    fetchSlugs();
    fetchBrands();
  }, [fetchBrandSlug, fetchDynamicCategories, fetchSlugs, fetchBrands]);

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
    
    // Auto-calculate final price when price or discount percentage changes
    if (name === "price" || name === "discountPercentage") {
      const price = name === "price" ? Number(value) : newData.price;
      const discountPercentage = name === "discountPercentage" ? Number(value) : newData.discountPercentage;
      newData.finalPrice = price - (price * discountPercentage / 100);
    }
    
    setProductData(newData);
  }, [productData]);

  const handleArrayChange = useCallback((setter: any, index: number, value: string) => {
    setter((prev: string[]) =>
      prev.map((item, idx) => (idx === index ? value : item))
    );
  }, []);

  const addArrayItem = useCallback((setter: any) =>
    setter((prev: string[]) => [...prev, ""]), []);

  const removeArrayItem = useCallback((setter: any, index: number) =>
    setter((prev: string[]) => prev.filter((_, idx) => idx !== index)), []);

  const updateVariantField = useCallback((
    index: number,
    field: keyof Variant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i === index) {
          const updatedVariant = { ...variant, [field]: value };
          
          // Auto-calculate final price when base price or discount changes
          if (field === 'baseprice' || field === 'discount') {
            const basePrice = field === 'baseprice' ? Number(value) : updatedVariant.baseprice || 0;
            const discount = field === 'discount' ? Number(value) : updatedVariant.discount || 0;
            updatedVariant.finalprice = basePrice - (basePrice * discount / 100);
          }
          
          return updatedVariant;
        }
        return variant;
      })
    );
  }, []);

  const addSpecification = useCallback(() => {
    setSpecifications(prev => [...prev, { key: "", value: "" }]);
  }, []);

  const updateSpecification = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setSpecifications(prev => 
      prev.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    );
  }, []);

  const removeSpecification = useCallback((index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addVariantSpecification = useCallback((variantIndex: number) => {
    setVariants(prev => {
      const updatedVariants = [...prev];
      if (!updatedVariants[variantIndex].specification) {
        updatedVariants[variantIndex].specification = [];
      }
      updatedVariants[variantIndex].specification!.push({ key: "", value: "" });
      return updatedVariants;
    });
  }, []);

  const updateVariantSpecification = useCallback((
    variantIndex: number,
    specIndex: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setVariants(prev => {
      const updatedVariants = [...prev];
      updatedVariants[variantIndex].specification![specIndex][field] = value;
      return updatedVariants;
    });
  }, []);

  const removeVariantSpecification = useCallback((variantIndex: number, specIndex: number) => {
    setVariants(prev => {
      const updatedVariants = [...prev];
      updatedVariants[variantIndex].specification!.splice(specIndex, 1);
      return updatedVariants;
    });
  }, []);



  const resetForm = useCallback(() => {
    setProductData({
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
      // Enhanced fields
      sku: "",
      lowStockThreshold: 10,
      returnPolicy: "",
      freeShipping: false,
      packingStandard: "",
      // New model fields
      innerSlug: "",
      innerSubSlug: "",
      dimensions: "",
      notes: "",
    });
    setProductImages([]);
    setTags([""]);
    setSpecifications([{key: "", value: ""}]);
    setVariants([]);
    setIsFeatured(false);
    setIsNewArrival(false);
    setSlugEdited(false);
    setSelectedSlugId("");
    setSelectedSubSlugId("");
    setAvailableSubSlugs([]);

  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!productData.name.trim()) {
      toast.error("❌ Product name is required.");
      return;
    }

    if (!productData.description || !productData.description.trim()) {
      toast.error("❌ Product description is required.");
      return;
    }

    if (productData.price <= 0) {
      toast.error("❌ Product price must be greater than 0.");
      return;
    }

    if (productData.finalPrice < 0) {
      toast.error("❌ Final price cannot be negative.");
      return;
    }

    if (productData.stockQuantity < 0) {
      toast.error("❌ Stock quantity cannot be negative.");
      return;
    }

    if (productImages.length === 0) {
      toast.error("❌ At least one product image is required.");
      return;
    }

    // Validate Category
    const finalCategory =
      selectedCategory === "Others" ? customCategory.trim() : selectedCategory;

    if (!finalCategory) {
      toast.error("❌ Please select or enter a category.");
      return;
    }

    // Validate variants if any
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (!variant.color || !variant.size) {
        toast.error(`❌ Variant ${i + 1}: Color and size are required.`);
        return;
      }
      if (!variant.baseprice || variant.baseprice <= 0) {
        toast.error(`❌ Variant ${i + 1}: Base price must be greater than 0.`);
        return;
      }
      if (variant.stock < 0) {
        toast.error(`❌ Variant ${i + 1}: Stock cannot be negative.`);
        return;
      }
    }

    const sellerEmail = user?.email || "";
    const sellerName = user?.name || "";
    const sellerNumber = user?.phone || 0;

    const finalData = {
      ...productData,
      urlSlug: productData.slug, // Save as urlSlug for URL-friendly access
      slug: selectedSlugId || undefined, // Include selected slug ObjectId
      subSlug: selectedSubSlugId || undefined, // Include selected subSlug ObjectId
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
      sellerEmail,
      sellerName,
      sellerNumber,
      deliveryCharges: deliveryCharges.filter(charge => charge.division && charge.district),
      defaultDeliveryCharge,
      status: "active",
      discountPercentage: productData.discountPercentage,
      finalPrice: productData.finalPrice
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
        // Navigate to seller products page
        setTimeout(() => {
          window.location.href = "/dashboard/seller/products";
        }, 1500);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      console.error("Error adding product:", err);
      console.error("Error response:", err.response?.data);
      if (err.response && err.response.status === 400) {
        toast.error(
          `❌ ${err.response.data.message || "Bad Request - Check console for details"}`
        );
      } else {
        toast.error("❌ Failed to add product.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {/* Label with asterisk if required */}
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

  const renderArrayField = (
    label: string,
    state: string[],
    setter: any,
    required = false
  ) => (
    <div className="flex flex-col gap-3">
      <label className="font-semibold text-navy-blue">
        {label}
        {required && <span className="text-accent-orange ml-1">*</span>}
      </label>

      {label === "Product Images" ? (
        <>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
            required={required}
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {state.map((img, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={img}
                  alt="Uploaded Preview"
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = state.filter((_, i) => i !== idx);
                    setter(newImages);
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
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
                className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                required={required}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(setter, idx)}
                className="bg-accent-orange hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setter)}
            className="bg-steel-gray hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Add {label}
          </button>
        </>
      )}
    </div>
  );

  const renderVariants = () => (
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
              onClick={() => removeVariant(index)}
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
                  value={variant.sku}
                  onChange={(e) => updateVariantField(index, "sku", e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-blue mb-2">Size</label>
                <input
                  type="text"
                  placeholder="Size (e.g., M, L, XL)"
                  value={variant.size}
                  onChange={(e) => {
                    updateVariantField(index, "size", e.target.value);
                    // Auto-update SKU when size changes
                    const newSku = generateSKU(productData.slug, variant.color, e.target.value);
                    updateVariantField(index, "sku", newSku);
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
                    updateVariantField(index, "color", color);
                    // Auto-update SKU when color changes
                    const newSku = generateSKU(productData.slug, color, variant.size);
                    updateVariantField(index, "sku", newSku);
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
                        updateVariantField(index, "color", e.target.value);
                        // Auto-update SKU when color changes
                        const newSku = generateSKU(productData.slug, e.target.value, variant.size);
                        updateVariantField(index, "sku", newSku);
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
                  onChange={(e) => updateVariantField(index, "innerSlug", e.target.value)}
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
                  onChange={(e) => updateVariantField(index, "innerSubSlug", e.target.value)}
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
                  value={variant.stock}
                  onChange={(e) => updateVariantField(index, "stock", Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-blue mb-2">Base Price</label>
                <input
                  type="number"
                  placeholder="Base Price"
                  value={variant.baseprice || ''}
                  onChange={(e) => updateVariantField(index, "baseprice", Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-blue mb-2">Discount %</label>
                <input
                  type="number"
                  placeholder="Discount %"
                  value={variant.discount || ''}
                  onChange={(e) => updateVariantField(index, "discount", Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-blue mb-2">Final Price</label>
                <input
                  type="number"
                  placeholder="Final Price"
                  value={variant.finalprice || ''}
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
                  onChange={(e) => updateVariantField(index, "weight", Number(e.target.value))}
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
                    if (files.length > 0) {
                      setLoading(true);
                      try {
                        const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
                        const uploadedUrls = await Promise.all(uploadPromises);
                        updateVariantField(index, "images", [...(variant.images || []), ...uploadedUrls]);
                        toast.success("✅ Variant images uploaded!");
                      } catch (error) {
                        toast.error("❌ Variant image upload failed!");
                      } finally {
                        setLoading(false);
                      }
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
                            const newImages = variant.images?.filter((_, i) => i !== imgIdx) || [];
                            updateVariantField(index, "images", newImages);
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
              value={variant.variantDescription || ''}
              onChange={(e) => updateVariantField(index, "variantDescription", e.target.value)}
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
                onClick={() => addVariantSpecification(index)}
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
                      onChange={(e) => updateVariantSpecification(index, specIndex, 'key', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Value (e.g., Cotton)"
                      value={spec.value}
                      onChange={(e) => updateVariantSpecification(index, specIndex, 'value', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariantSpecification(index, specIndex)}
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
        onClick={addVariant}
        className="w-full bg-navy-blue hover:bg-blue-800 text-white py-4 rounded-lg transition-colors duration-200 font-semibold text-lg shadow-sm"
      >
        + Add New Variant
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <ToastContainer />
        {loading && (
          <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center text-navy-blue mb-10">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-navy-blue mb-2">
                Add New Product
              </h1>
              <p className="text-steel-gray">
                Fill in the details below to add your product to the store
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
                {renderInputField("Discount %", "discountPercentage", "number", Percent, "#F39C12", true)}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-navy-blue mb-1 flex items-center gap-1">
                    Final Price
                    <span className="text-accent-orange">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-gray">
                      <DollarSign className="w-5 h-5" color="#F39C12" />
                    </div>
                    <input
                      type="number"
                      value={productData.finalPrice || ''}
                      readOnly
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg shadow-sm text-sm text-navy-blue bg-gray-100 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>
                {renderInputField("Stock Quantity", "stockQuantity", "number", Layers, "#F39C12", true)}
              </div>
            </div>
            {/* Category Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent-orange" />
                Category & Brand
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-navy-blue mb-2 flex items-center gap-1">
                    Category
                    <span className="text-accent-orange">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
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
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-navy-blue mb-2 flex items-center gap-1">
                      Brand
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
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

            {/* Enhanced Fields Section */}
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
                      setSelectedSubSlugId(""); // Reset subslug when slug changes
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
                {renderArrayField("Product Images", productImages, setProductImages, true)}
                {renderArrayField("Tags", tags, setTags)}
              </div>
            </div>
            
            {/* Specifications Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-navy-blue flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-accent-orange" />
                  Specifications (Key-Value Pairs)
                </h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="bg-steel-gray hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  Add Specification
                </button>
              </div>
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Key (e.g., Material)"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., Cotton)"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-navy-blue focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="bg-accent-orange hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {/* Affiliate Link Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-accent-orange" />
                Affiliate Settings
              </h2>
              {renderInputField(
                "Affiliate Link (Only fill this field if the product is affiliate type. Otherwise leave it empty.)",
                "affiliateLink",
                "text",
                Link,
                "#F39C12",
                false
              )}
            </div>

            {/* Product Options Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6">Product Options</h2>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 text-navy-blue font-medium">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-accent-orange bg-white border-gray-300 rounded focus:ring-accent-orange focus:ring-2"
                  />
                  Featured Product
                </label>
                <label className="flex items-center gap-3 text-navy-blue font-medium">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 text-accent-orange bg-white border-gray-300 rounded focus:ring-accent-orange focus:ring-2"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-3 text-navy-blue font-medium">
                  <input
                    type="checkbox"
                    checked={productData.freeShipping}
                    onChange={(e) => setProductData(prev => ({...prev, freeShipping: e.target.checked}))}
                    className="w-4 h-4 text-accent-orange bg-white border-gray-300 rounded focus:ring-accent-orange focus:ring-2"
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
                  Add multiple variants with different colors, sizes, and prices.
                </p>
              </div>
              {renderVariants()}
            </div>
            
            {/* Delivery Charges Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-navy-blue mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent-orange" />
                Delivery Settings
              </h2>
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
                Add Product to Store
              </button>
            </div>
          </form>
        </div>
      </div>
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
