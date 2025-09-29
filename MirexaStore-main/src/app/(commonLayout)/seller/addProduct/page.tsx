"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/lib/utils/withAuth";
import { HexColorPicker } from "react-colorful";
import {
  Package,
  Tag,
  Image,
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
import React from "react";
import DeliveryChargesForm from "../../components/ui/deliveryCharges";

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
interface Slug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  innerSlugs?: string[];
}

interface SubSlug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentSlug: string;
  innerSubSlugs?: string[];
}

interface ProductData {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discount: number;
  stockQuantity: number;
  category: string;
  brand: string;
  materials: string;
  specifications: string;
  sku: string;
  lowStockThreshold: number;
  trackInventory: boolean;
  freeShipping: boolean;
  returnPolicy: string;
  urlSlug: string;
  type: "own" | "affiliate";
  affiliateLink?: string;
  videoUrl: string;
  defaultDeliveryCharge: number;
  weight: number;
  dimensions: string;
  warranty: string;
  notes: string;
  sellerEmail: string;
  slug?: string;
  subSlug?: string;
}

interface Variant {
  innerSlug?: string;
  innerSubSlug?: string;
  color: string;
  size: string;
  baseprice: number;
  discount?: number;
  finalprice: number;
  stock: number;
  description: string;
  variantDescription: string;
  specification: Array<{ key: string; value: string }>;
  sku: string;
  price: number;
  images: string[];
  weight: number;
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
    description: "",
    longDescription: "",
    price: 0,
    discount: 0,
    stockQuantity: 0,
    category: "",
    brand: "",
    materials: "",
    specifications: "",
    sku: "",
    lowStockThreshold: 10,
    trackInventory: true,
    freeShipping: false,
    returnPolicy: "",
    urlSlug: "",
    type: "own",
    affiliateLink: "",
    videoUrl: "",
    defaultDeliveryCharge: 0,
    weight: 0,
    dimensions: "",
    warranty: "",
    notes: "",
    sellerEmail: "",
  });

  const [productImages, setProductImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([""]);
  const [colors, setColors] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [deliveryCharges, setDeliveryCharges] = React.useState<
    DeliveryCharge[]
  >([]);
  const [defaultDeliveryCharge, setDefaultDeliveryCharge] = React.useState(0);
  const [slugs, setSlugs] = useState<Slug[]>([]);
  const [subSlugs, setSubSlugs] = useState<SubSlug[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>("");
  const [filteredSubSlugs, setFilteredSubSlugs] = useState<SubSlug[]>([]);

  const handleDeliveryChange = (
    charges: DeliveryCharge[],
    defaultCharge: number
  ) => {
    setDeliveryCharges(charges);
    setDefaultDeliveryCharge(defaultCharge);
  };

  // Fetch slugs and subslugs on component mount
  useEffect(() => {
    const fetchSlugsAndSubSlugs = async () => {
      try {
        console.log('Fetching slugs and subslugs...');
        const [slugsResponse, subSlugsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/slug`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subslug`)
        ]);
        
        console.log('Slugs Response:', slugsResponse.data);
        console.log('SubSlugs Response:', subSlugsResponse.data);
        
        // Handle the API response structure like in slug management page
        const slugsData = slugsResponse.data.result === "Done" ? slugsResponse.data.data : [];
        const subSlugsData = subSlugsResponse.data.result === "Done" ? subSlugsResponse.data.data : [];
        
        console.log('Processed Slugs:', slugsData);
        console.log('Processed SubSlugs:', subSlugsData);
        
        setSlugs(slugsData);
        setSubSlugs(subSlugsData);
      } catch (error) {
        console.error('Error fetching slugs and subslugs:', error);
        toast.error('Failed to load slug options');
      }
    };

    fetchSlugsAndSubSlugs();
  }, []);

  // Filter subslugs based on selected slug
  useEffect(() => {
    if (selectedSlug) {
      const filtered = subSlugs.filter(subSlug => subSlug.parentSlug === selectedSlug);
      setFilteredSubSlugs(filtered);
      setSelectedSubSlug(""); // Reset subslug selection when slug changes
    } else {
      setFilteredSubSlugs([]);
      setSelectedSubSlug("");
    }
  }, [selectedSlug, subSlugs]);

  const handleSlugChange = (slugId: string) => {
    setSelectedSlug(slugId);
    setProductData(prev => ({ ...prev, slug: slugId }));
  };

  const handleSubSlugChange = (subSlugId: string) => {
    setSelectedSubSlug(subSlugId);
    setProductData(prev => ({ ...prev, subSlug: subSlugId }));
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

  useEffect(() => {
    if (!slugEdited && productData.name) {
      const newSlug = productData.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      
      setProductData((prev) => ({
        ...prev,
        urlSlug: newSlug,
      }));
    }
  }, [productData.name, slugEdited]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "urlSlug") setSlugEdited(true);
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
    const sku = generateSKU(productData.name, color, size);
    if (!variants.some((v) => v.color === color && v.size === size)) {
      setVariants((prev) => [
        ...prev,
        { 
          sku, 
          color, 
          size, 
          baseprice: productData.price,
          discount: 0,
          finalprice: productData.price,
          stock: 0, 
          price: productData.price, 
          images: [],
          description: "This is a sample variant description",
          variantDescription: "",
          specification: [],
          weight: 0,
          innerSlug: "",
          innerSubSlug: ""
        },
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
      description: "",
      longDescription: "",
      price: 0,
      discount: 0,
      stockQuantity: 0,
      category: "",
      brand: "",
      materials: "",
      specifications: "",
      sku: "",
      lowStockThreshold: 10,
      trackInventory: true,
      freeShipping: false,
      returnPolicy: "",
      urlSlug: "",
      type: "own",
      affiliateLink: "",
      videoUrl: "",
      defaultDeliveryCharge: 0,
      weight: 0,
      dimensions: "",
      warranty: "",
      notes: "",
      sellerEmail: "",
      slug: "",
      subSlug: "",
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
      category: finalCategory,
      type: productData.affiliateLink ? "affiliate" : "own",
      productImages,
      tags,
      features,
      isFeatured,
      isNewArrival,
      variants,
      sellerEmail,
      sellerName,
      sellerNumber,
      deliveryCharges,
      defaultDeliveryCharge,
      slug: selectedSlug || undefined,
      subSlug: selectedSubSlug || undefined,
      specifications: productData.specifications ? 
        productData.specifications.split(',').map(spec => {
          const [key, value] = spec.split(':');
          return { key: key?.trim() || '', value: value?.trim() || '' };
        }).filter(spec => spec.key && spec.value) : [],
      status: 'draft',
      viewCount: 0,
      wishlistCount: 0,
      rating: 0,
      totalReviews: 0,
      reviews: [],
      relatedProducts: [],
      deletedBy: null,
      isDeleted: false
    };
    
    delete finalData.slug;

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
        setSelectedSlug("");
        setSelectedSubSlug("");
        setFilteredSubSlugs([]);
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
              <img
                key={idx}
                src={img}
                alt="Uploaded Preview"
                className="w-24 h-24 object-cover rounded-md border"
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
              value={generateSKU(productData.name, color, size)}
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
            <div className="mt-4 space-y-4">
              {/* Slug and SubSlug Selection for Variant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inner Slug
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => updateVariantSlugField(color, size, "innerSlug", e.target.value)}
                    disabled={!selectedSlug}
                  >
                    <option value="">Select Inner Slug</option>
                    {selectedSlug && slugs.find(s => s._id === selectedSlug)?.innerSlugs?.map((innerSlug, index) => (
                      <option key={index} value={innerSlug}>
                        {innerSlug}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inner SubSlug
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => updateVariantSlugField(color, size, "innerSubSlug", e.target.value)}
                    disabled={!selectedSubSlug}
                  >
                    <option value="">Select Inner SubSlug</option>
                    {selectedSubSlug && filteredSubSlugs.find(s => s._id === selectedSubSlug)?.innerSubSlugs?.map((innerSubSlug, index) => (
                      <option key={index} value={innerSubSlug}>
                        {innerSubSlug}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Stock"
                  onChange={(e) => updateVariantField(color, size, "stock", Number(e.target.value))}
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Base Price"
                  onChange={(e) => updateVariantField(color, size, "baseprice", Number(e.target.value))}
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  onChange={(e) => updateVariantField(color, size, "discount", Number(e.target.value))}
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Final Price"
                  onChange={(e) => updateVariantField(color, size, "finalprice", Number(e.target.value))}
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Weight (kg)"
                  onChange={(e) => updateVariantField(color, size, "weight", Number(e.target.value))}
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Images (comma separated URLs)"
                  onChange={(e) => updateVariantField(color, size, "images", e.target.value.split(",").map(url => url.trim()).filter(url => url))}
                  className="p-3 border border-gray-300 rounded-md"
                />
              </div>
              <textarea
                placeholder="Variant Description"
                onChange={(e) => updateVariantField(color, size, "variantDescription", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          )}
        </div>
      ))
    );

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <ToastContainer />
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center text-2xl font-semibold text-gray-800">
          Add Product
        </div>
        {renderInputField("Product Name", "name", "text", Tag, "#F6550C", true)}
        {renderInputField(
          "URL Slug (Editable)",
          "urlSlug",
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
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Beauty & Personal Care">Beauty & Personal Care</option>
          <option value="Sports & Outdoors">Sports & Outdoors</option>
          <option value="Toys & Games">Toys & Games</option>
          <option value="Automotive">Automotive</option>
          <option value="Health & Wellness">Health & Wellness</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Jewelry & Accessories">Jewelry & Accessories</option>
          <option value="Garden & Outdoor">Garden & Outdoor</option>
          <option value="Baby Products">Baby Products</option>
          <option value="Groceries & Gourmet Food">
            Groceries & Gourmet Food
          </option>
          <option value="Pet Supplies">Pet Supplies</option>
          <option value="Music & Instruments">Music & Instruments</option>
          <option value="Movies & TV Shows">Movies & TV Shows</option>
          <option value="Tools & Hardware">Tools & Hardware</option>
          <option value="Computers & Accessories">
            Computers & Accessories
          </option>
          <option value="Mobile Phones & Accessories">
            Mobile Phones & Accessories
          </option>
          <option value="Footwear">Footwear</option>
          <option value="Handbags & Wallets">Handbags & Wallets</option>
          <option value="Art & Craft Supplies">Art & Craft Supplies</option>
          <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
          <option value="Collectibles & Memorabilia">
            Collectibles & Memorabilia
          </option>
          <option value="Kitchen Appliances">Kitchen Appliances</option>
          <option value="Furniture">Furniture</option>
          <option value="Software & Apps">Software & Apps</option>
          <option value="Industrial & Scientific">
            Industrial & Scientific
          </option>
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
        {renderInputField("SKU", "sku", "text", Archive, "#F6550C")}
        
        {/* Slug Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
            Slug ({slugs.length} available)
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
            value={selectedSlug}
            onChange={(e) => handleSlugChange(e.target.value)}
          >
            <option value="">Select Slug</option>
            {slugs.map((slug) => {
              console.log('Rendering slug:', slug);
              return (
                <option key={slug._id} value={slug._id}>
                  {slug.name}
                </option>
              );
            })}
          </select>
          {slugs.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              No slugs found. Please create some slugs first.
            </p>
          )}
        </div>

        {/* Sub Slug Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
            Sub Slug ({filteredSubSlugs.length} available)
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
            value={selectedSubSlug}
            onChange={(e) => handleSubSlugChange(e.target.value)}
            disabled={!selectedSlug || filteredSubSlugs.length === 0}
          >
            <option value="">Select Sub Slug</option>
            {filteredSubSlugs.map((subSlug) => {
              console.log('Rendering subslug:', subSlug);
              return (
                <option key={subSlug._id} value={subSlug._id}>
                  {subSlug.name}
                </option>
              );
            })}
          </select>
          {selectedSlug && filteredSubSlugs.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No sub slugs available for the selected slug
            </p>
          )}
          {subSlugs.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              No subslugs found. Please create some subslugs first.
            </p>
          )}
        </div>
        {renderInputField("Low Stock Threshold", "lowStockThreshold", "number", Archive, "#F6550C")}
        {renderInputField("Return Policy", "returnPolicy", "text", Shield, "#F6550C")}
        {renderInputField("Dimensions", "dimensions", "text", Box, "#F6550C")}
        {renderInputField("Notes", "notes", "text", FileText, "#F6550C")}
        {renderInputField("Default Delivery Charge", "defaultDeliveryCharge", "number", DollarSign, "#F6550C")}
        
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={productData.trackInventory}
              onChange={(e) => setProductData(prev => ({...prev, trackInventory: e.target.checked}))}
            />
            Track Inventory
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={productData.freeShipping}
              onChange={(e) => setProductData(prev => ({...prev, freeShipping: e.target.checked}))}
            />
            Free Shipping
          </label>
        </div>
        
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
          "Affiliate Link (Only fill this field if the product is affiliate type. Otherwise leave it empty.)",
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
