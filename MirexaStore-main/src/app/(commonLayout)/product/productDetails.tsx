/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReviewsSection from "./review";
import FloatingIcons from "../components/ui/FloatingIcons";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { HiPlus, HiMinus, HiHeart, HiOutlineHeart, HiShare, HiStar } from "react-icons/hi";
import { HiMagnifyingGlassPlus, HiXMark } from "react-icons/hi2";
import SellerProfileCard from "../components/ui/SellerProfileCard";
import ProductDetailsSkeleton from "../components/skeleton/ProductDetailsSkeleton";
import RecentlyViewed from "../components/ui/RecentlyViewed";
import RelatedProducts from "../components/ui/RelatedProducts";
import DeliveryEstimator from "../components/ui/DeliveryEstimator";
import ProductQA from "../components/ui/ProductQA";
import TrustIndicators from "../components/ui/TrustIndicators";
import AvailableOffers from "../components/ui/AvailableOffers";

// Enhanced ProductDetailsProps with all new backend model fields
interface Slug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface SubSlug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentSlug: string;
}

interface ProductDetailsProps {
  product: {
    type: string;
    affiliateLink: string | undefined;
    data: {
      _id: string;
      name: string;
      description: string;
      price: number;
      stockQuantity: number;
      category: string;
      longDescription?: string;
      materials?: string;
      careInstructions?: string;
      specifications?: Specification[];
      additionalInfo?: string;

      // Essential E-commerce Fields
      sku?: string;
      metaTitle?: string;
      metaDescription?: string;
      lowStockThreshold?: number;
      trackInventory?: boolean;
      viewCount?: number;
      wishlistCount?: number;
      relatedProducts?: string[];
      freeShipping?: boolean;
      returnPolicy?: string;
      finalPrice?: number;

      // Advanced Features
      innerSlug?: string;
      innerSubSlug?: string;
      defaultDescription?: string;
      variantDescription?: string;
      addedBy?: string;

      // Slug System
      slug?: Slug;
      subSlug?: SubSlug;
      
      // Product Settings
      type: string;
      affiliateLink?: string;
      discountPrice?: number;
      brand?: string;
      tags?: string[];

      // Variants
      variants?: Variant[];

      // Images and Media
      productImages: string[];
      videoUrl?: string;

      // Reviews and Ratings
      rating?: number;
      totalReviews?: number;

      // Status
      status?: 'active' | 'inactive' | 'draft';
      isFeatured?: boolean;
      isNewArrival?: boolean;

      // Seller Info
      sellerId?: string;
      sellerName?: string;
      sellerEmail?: string;
      sellerNumber?: number;

      // Additional Details
      features?: string[] | boolean;
      notes?: string;
      weight?: number | React.JSX.Element;
      dimensions?: string;
      warranty?: string | ReactNode;

      // System Fields
      createdAt?: string;
      updatedAt?: string;
    };
  };
  relatedProducts?: {
    data: {
      _id: string;
      name: string;
      price: number;
      discountPrice?: number;
      productImages: string[];
      category?: string;
      brand?: string;
      averageRating?: number;
      totalReviews?: number;
    }[];
  };
}

// Enhanced Variant Type with all new backend model fields
interface Specification {
  key: string;
  value: string;
}

type Variant = {
  color?: string;
  size?: string;
  sku?: string;
  price?: number;
  stock?: number;
  images?: string[];
  weight?: number;
  innerSlug?: string;
  innerSubSlug?: string;
  basePrice?: number;
  discount?: number;
  finalPrice?: number;
  defaultDescription?: string;
  variantDescription?: string;
  specifications?: Specification[];
  specification?: Specification[]; // Backend uses singular form
};

export interface ReviewReply {
  _id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
}

interface Review {
  updatedAt: string;
  createdAt: string;
  _id: string;
  userName?: string;
  userId: {
    _id: string;
    name: string;
  };
  timestamp: string;
  rating: number;
  comment: string;
  likes: string[];
  replies: {
    _id: string;
    userId: string;
    comment: string;
    userName: string;
    timestamp: string;
    isEditing: boolean;
  }[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, relatedProducts = { data: [] } }) => {
  const router = useRouter();
  
  // Helper functions first
  const safeJsonParse = useCallback((str: string, fallback: any = []) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }, []);

  const validateApiUrl = useCallback((url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      const allowedDomains = ['localhost', '127.0.0.1', process.env.NEXT_PUBLIC_API_DOMAIN];
      return allowedDomains.some(domain => parsedUrl.hostname.includes(domain || ''));
    } catch {
      return false;
    }
  }, []);

  const getUserAndToken = () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!storedUser || !token) {
      toast.error("Please log in first.");
      const currentPath = window.location.pathname + window.location.search;
      setTimeout(() => router.push(`/login?redirect=${encodeURIComponent(currentPath)}`), 1500);
      return null;
    }

    const user = safeJsonParse(storedUser);
    if (!user._id) {
      toast.error('Please log in again.');
      return null;
    }

    return { user, token };
  };

  // Consolidated state declarations
  const [cartQuantity, setCartQuantity] = useState(1);
  const [stockQuantity, setStockQuantity] = useState(product.data.stockQuantity);
  const [sellerData, setSellerData] = useState<{
    profile: any | null;
    rating: { averageRating: number; totalReviews: number; } | null;
    followersCount: number;
    isFollowing: boolean;
  }>({ profile: null, rating: null, followersCount: 0, isFollowing: false });
  const [uiState, setUiState] = useState({
    isWishlisted: false,
    showImageModal: false,
    showShareModal: false,
    showStockAlert: false,
    isComparing: false,
    isLoading: false,
    showFullDescription: false,
    isLoadingVariant: false
  });
  const [userEmail, setUserEmail] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [variantState, setVariantState] = useState<{
    selected: Variant | null;
    price: number | null;
    stock: number | null;
    innerSlug: string;
    innerSubSlug: string;
  }>({ selected: null, price: null, stock: null, innerSlug: '', innerSubSlug: '' });
  const [dynamicProductDetails, setDynamicProductDetails] = useState({
    sku: product.data.sku || '',
    size: '',
    color: '#000000',
    stockQuantity: product.data.stockQuantity,
    basePrice: product.data.price,
    discount: 0,
    finalPrice: product.data.discountPrice || product.data.price,
    weight: product.data.weight || 0,
    images: product.data.productImages,
    description: product.data.variantDescription || product.data.description,
    specifications: product.data.specifications || []
  });
  const [selectedImage, setSelectedImage] = useState(
    product.data.productImages && product.data.productImages.length > 0 
      ? product.data.productImages[0] 
      : ''
  );
  const [brandLogo, setBrandLogo] = useState<string | null>(null);

  // Initialize variants on component mount
  useEffect(() => {
    if (product?.data?.variants && product.data.variants.length > 0) {
      const firstVariant = product.data.variants.find(v => v.innerSlug) || product.data.variants[0];
      if (firstVariant) {
        setVariantState({
          selected: firstVariant,
          price: (firstVariant as any).finalprice || firstVariant.finalPrice || firstVariant.price || null,
          stock: firstVariant.stock || null,
          innerSlug: firstVariant.innerSlug || '',
          innerSubSlug: firstVariant.innerSubSlug || ''
        });
        updateProductDetails(firstVariant);
      }
    }
  }, [product.data.variants]);

  // Fetch brand logo and initialize data
  useEffect(() => {
    const fetchBrandLogo = async () => {
      if (!product.data.brand || !process.env.NEXT_PUBLIC_API_URL) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`);
        if (response.ok) {
          const brandsResponse = await response.json();
          const brandsData = brandsResponse.data || brandsResponse;
          if (Array.isArray(brandsData)) {
            const brand = brandsData.find((b: any) => b.name === product.data.brand);
            setBrandLogo(brand?.logo || null);
          }
        }
      } catch (error) {
        console.error('Error fetching brand logo:', error);
      }
    };
    fetchBrandLogo();
  }, [product.data.brand]);

  // Update variant when slugs change
  useEffect(() => {
    if (!product.data.variants || !variantState.innerSlug) return;
    
    const matchingVariant = product.data.variants.find(v => 
      v.innerSlug === variantState.innerSlug && 
      (!variantState.innerSubSlug || v.innerSubSlug === variantState.innerSubSlug)
    ) || product.data.variants.find(v => v.innerSlug === variantState.innerSlug);
    
    if (matchingVariant) {
      setVariantState(prev => ({ ...prev, selected: matchingVariant }));
      updateProductDetails(matchingVariant);
    }
  }, [product.data.variants, variantState.innerSlug, variantState.innerSubSlug]);

  // Update selected image when dynamic images change
  useEffect(() => {
    if (dynamicProductDetails.images && dynamicProductDetails.images.length > 0) {
      setSelectedImage(dynamicProductDetails.images[0]);
    }
  }, [dynamicProductDetails.images]);

  // Computed values
  const { longDesc, isLong, displayDesc } = useMemo(() => {
    const rawDesc = product?.data?.longDescription;
    const longDesc = typeof rawDesc === "string" ? rawDesc : "";
    const isLong = longDesc.length > 300;
    const displayDesc = isLong && !uiState.showFullDescription ? longDesc.slice(0, 300) + "..." : longDesc;
    return { longDesc, isLong, displayDesc };
  }, [product?.data?.longDescription, uiState.showFullDescription]);

  const validateVariantSelection = useCallback(() => {
    if (!product.data.variants || product.data.variants.length === 0) return { isValid: true };
    
    // Check if any variants have colors and user hasn't selected one
    const hasColorVariants = product.data.variants.some(v => 
      (Array.isArray(v.color) && v.color.length > 0) || 
      (typeof v.color === 'string' && v.color.trim() !== '')
    );
    
    if (hasColorVariants && !variantState.selected?.color) {
      return { isValid: false, message: "Please select a color for this product." };
    }
    
    // Check if any variants have sizes and user hasn't selected one
    const hasSizeVariants = product.data.variants.some(v => 
      (Array.isArray(v.size) && v.size.length > 0) || 
      (typeof v.size === 'string' && v.size.trim() !== '')
    );
    
    if (hasSizeVariants && !variantState.selected?.size) {
      return { isValid: false, message: "Please select a size for this product." };
    }
    
    // Check if innerSlug selection is required
    const hasInnerSlugVariants = product.data.variants.some(v => v.innerSlug);
    if (hasInnerSlugVariants && !variantState.innerSlug) {
      return { isValid: false, message: "Please select a variant option." };
    }
    
    return { isValid: true };
  }, [product.data.variants, variantState.selected, variantState.innerSlug]);

  // Memoized calculations
  const allImages = useMemo(() => {
    const mainImages = product.data.productImages || [];
    const variantImages = variantState.selected?.images || [];
    
    // If variant has images, prioritize them, otherwise use main images
    if (variantImages.length > 0) {
      return [...new Set([...variantImages, ...mainImages])];
    }
    return mainImages;
  }, [product.data.productImages, variantState.selected?.images]);

  const currentPrice = useMemo(() => dynamicProductDetails.finalPrice, [dynamicProductDetails.finalPrice]);
  const currentStock = useMemo(() => dynamicProductDetails.stockQuantity, [dynamicProductDetails.stockQuantity]);

  const getBulkPricing = useCallback((quantity: number) => {
    const basePrice = currentPrice;
    if (quantity >= 50) return Math.round(basePrice * 0.85);
    if (quantity >= 20) return Math.round(basePrice * 0.9);
    if (quantity >= 10) return Math.round(basePrice * 0.95);
    return basePrice;
  }, [currentPrice]);

  // Handlers for slug changes
  const handleInnerSlugChange = useCallback((innerSlug: string) => {
    setUiState(prev => ({ ...prev, isLoadingVariant: true }));
    
    if (product.data.variants) {
      const filteredVariants = product.data.variants.filter(v => v.innerSlug === innerSlug);
      const availableSubSlugs = [...new Set(filteredVariants.map(v => v.innerSubSlug).filter(Boolean))] as string[];
      
      setVariantState(prev => ({
        ...prev,
        innerSlug,
        innerSubSlug: availableSubSlugs.length > 0 ? availableSubSlugs[0] : ''
      }));
    }

    setTimeout(() => setUiState(prev => ({ ...prev, isLoadingVariant: false })), 300);
  }, [product.data.variants]);

  const handleInnerSubSlugChange = useCallback((innerSubSlug: string) => {
    setUiState(prev => ({ ...prev, isLoadingVariant: true }));
    setVariantState(prev => ({ ...prev, innerSubSlug }));
    setTimeout(() => setUiState(prev => ({ ...prev, isLoadingVariant: false })), 300);
  }, []);

  // Track product view
  useEffect(() => {
    const viewedProducts = safeJsonParse(localStorage.getItem('recentlyViewed') || '[]');
    const productData = {
      _id: product.data._id,
      name: product.data.name,
      price: product.data.price,
      image: product.data.productImages[0],
      viewedAt: new Date().toISOString()
    };
    
    const filtered = viewedProducts.filter((p: any) => p._id !== product.data._id);
    filtered.unshift(productData);
    
    try {
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }, [product.data._id, safeJsonParse]);

  // Update product details based on selected variant
  const updateProductDetails = useCallback((variant: Variant) => {
    const mainSpecs = product.data.specifications || [];
    const variantSpecs = variant.specification || variant.specifications || [];
    const combinedSpecs = [...mainSpecs, ...variantSpecs];
    
    // Handle variant pricing with proper field names from backend
    const variantBasePrice = (variant as any).baseprice || variant.basePrice || variant.price || product.data.price;
    const variantFinalPrice = (variant as any).finalprice || variant.finalPrice || variant.price || product.data.discountPrice || product.data.price;
    
    // Handle variant images - fallback to main product images if variant has no images
    const variantImages = variant.images && variant.images.length > 0 ? variant.images : product.data.productImages;
    
    setDynamicProductDetails({
      sku: variant.sku || `product-#${Math.random().toString(36).substr(2, 6)}-${variant.innerSlug ?? 'default'}`,
      size: variant.size ?? 'One Size',
      color: variant.color ?? '#000000',
      stockQuantity: variant.stock ?? product.data.stockQuantity,
      basePrice: variantBasePrice,
      discount: variant.discount ?? 0,
      finalPrice: variantFinalPrice,
      weight: variant.weight ?? product.data.weight ?? 0,
      images: variantImages,
      description: variant.variantDescription ?? 
        (variant.specification && variant.specification.length > 0 
          ? `${product.data.description} - ${variant.innerSlug?.toUpperCase() ?? ''} ${variant.innerSubSlug?.toUpperCase() ?? ''} variant with ${variant.specification.map(spec => spec.value).join(', ')}.`
          : product.data.description),
      specifications: combinedSpecs
    });
  }, [product.data]);



  const handleVariantChange = useCallback((type: string, value: string) => {
    const updatedVariant = { ...variantState.selected, [type]: value };
    const matchedVariant = product.data.variants?.find((variant) => {
      const matchColor = updatedVariant.color ? variant.color === updatedVariant.color : true;
      const matchSize = updatedVariant.size ? variant.size === updatedVariant.size : true;
      return matchColor && matchSize;
    });

    if (matchedVariant) {
      setVariantState(prev => ({
        ...prev,
        selected: updatedVariant,
        price: ((matchedVariant as any).finalprice || matchedVariant.finalPrice || matchedVariant.price) ?? null,
        stock: matchedVariant.stock ?? null
      }));
    } else {
      setVariantState(prev => ({ ...prev, selected: updatedVariant, price: null, stock: null }));
    }
  }, [variantState.selected, product.data.variants]);

  // Fetch seller data
  useEffect(() => {
    const fetchSellerData = async () => {
      if (!product.data.sellerEmail || !process.env.NEXT_PUBLIC_API_URL) return;
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!validateApiUrl(baseUrl)) return;

      try {
        const [profileRes, ratingRes] = await Promise.allSettled([
          axios.get(`${baseUrl}/seller/profile/${encodeURIComponent(product.data.sellerEmail)}`),
          axios.get(`${baseUrl}/seller/rating/${encodeURIComponent(product.data.sellerEmail)}`)
        ]);

        let newSellerData = { ...sellerData };

        if (profileRes.status === 'fulfilled') {
          const profile = profileRes.value.data.data;
          newSellerData.profile = profile;
          
          // Fetch followers and following status
          try {
            const [followersRes, followingRes] = await Promise.allSettled([
              axios.get(`${baseUrl}/seller/followers/${encodeURIComponent(profile._id)}`).catch(() => ({ data: { followers: 0 } })),
              localStorage.getItem("accessToken") ? 
                axios.get(`${baseUrl}/seller/is-following?sellerId=${encodeURIComponent(profile._id)}`, 
                  { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } })
                  .catch(() => ({ data: { isFollowing: false } })) : 
                Promise.resolve({ data: { isFollowing: false } })
            ]);
            
            if (followersRes.status === 'fulfilled') {
              newSellerData.followersCount = followersRes.value.data.followers || 0;
            }
            if (followingRes.status === 'fulfilled') {
              newSellerData.isFollowing = followingRes.value.data.isFollowing || false;
            }
          } catch (error) {
            console.error('Error fetching seller follow data:', error);
            newSellerData.followersCount = 0;
            newSellerData.isFollowing = false;
          }
        }

        if (ratingRes.status === 'fulfilled') {
          newSellerData.rating = ratingRes.value.data.data;
        }

        setSellerData(newSellerData);
      } catch (error) {
        console.error("Failed to fetch seller data:", error);
      }
    };

    fetchSellerData();
  }, [product.data.sellerEmail]);

  // Check wishlist and fetch reviews
  useEffect(() => {
    const fetchInitialData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl || !validateApiUrl(baseUrl)) return;

      try {
        const token = localStorage.getItem('accessToken');
        const [wishlistRes, reviewsRes] = await Promise.allSettled([
          // token ? axios.get(`${baseUrl}/wishlist/check/${encodeURIComponent(product.data._id)}`, 
          //   { headers: { Authorization: `Bearer ${token}` } }) : 
          Promise.resolve({ data: { isWishlisted: false } }),
          axios.get(`${baseUrl}/reviews/${encodeURIComponent(product.data._id)}`)
        ]);

        if (wishlistRes.status === 'fulfilled') {
          setUiState(prev => ({ ...prev, isWishlisted: wishlistRes.value.data.isWishlisted }));
        }
        if (reviewsRes.status === 'fulfilled') {
          setReviews(reviewsRes.value.data.data);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, [product.data._id]);

  const handleWishlistToggle = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please log in to add to wishlist');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl || !validateApiUrl(baseUrl)) {
        toast.error('Service unavailable');
        return;
      }

      // Wishlist functionality not implemented in backend yet
      // const url = uiState.isWishlisted ? 'remove' : 'add';
      // await axios.post(
      //   `${baseUrl}/wishlist/${url}`,
      //   { productId: product.data._id },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      
      setUiState(prev => ({ ...prev, isWishlisted: !prev.isWishlisted }));
      toast.success(uiState.isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Error updating wishlist');
    }
  }, [uiState.isWishlisted, product.data._id]);

  const handleShare = useCallback(async (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product.data.name}`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } else if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls]);
    }
    setUiState(prev => ({ ...prev, showShareModal: false }));
  }, [product.data.name]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <HiStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
      />
    ));
  };

  const handleStockAlert = useCallback(async () => {
    if (!userEmail) {
      toast.error('Please enter your email');
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl || !validateApiUrl(baseUrl)) {
        toast.error('Service unavailable');
        return;
      }

      await axios.post(`${baseUrl}/products/stock-alert`, {
        productId: product.data._id,
        email: userEmail,
        productName: product.data.name
      });
      
      toast.success('You will be notified when this item is back in stock!');
      setUiState(prev => ({ ...prev, showStockAlert: false }));
      setUserEmail('');
    } catch (error) {
      console.error('Stock alert error:', error);
      toast.error('Error setting up stock alert');
    }
  }, [userEmail, product.data._id, product.data.name]);

  const handleAddToCompare = useCallback(() => {
    const compareList = safeJsonParse(localStorage.getItem('compareList') || '[]');
    const productData = {
      _id: product.data._id,
      name: product.data.name,
      price: product.data.price,
      image: product.data.productImages[0],
      rating: product.data.rating,
      brand: product.data.brand
    };
    
    if (compareList.find((p: any) => p._id === product.data._id)) {
      toast.error('Product already in comparison list');
      return;
    }
    
    if (compareList.length >= 4) {
      toast.error('You can compare maximum 4 products');
      return;
    }
    
    compareList.push(productData);
    try {
      localStorage.setItem('compareList', JSON.stringify(compareList));
      setUiState(prev => ({ ...prev, isComparing: true }));
      toast.success('Added to comparison list');
    } catch (error) {
      console.error('Error adding to compare:', error);
      toast.error('Error adding to comparison list');
    }
  }, [product.data, safeJsonParse]);



  const handleFollowToggle = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl || !validateApiUrl(baseUrl)) {
        toast.error('Service unavailable');
        return;
      }

      const url = sellerData.isFollowing ? "unfollow" : "follow";
      await axios.post(
        `${baseUrl}/seller/${url}`,
        { sellerId: sellerData.profile._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellerData(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }));
    } catch (error) {
      console.error("Follow action failed:", error);
      toast.error('Error updating follow status');
    }
  }, [sellerData.isFollowing, sellerData.profile]);



  const handleAddToCart = useCallback(() => {
    if (uiState.isLoading) return;
    setUiState(prev => ({ ...prev, isLoading: true }));

    const auth = getUserAndToken();
    if (!auth) {
      setUiState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const validation = validateVariantSelection();
    if (!validation.isValid) {
      toast.error(validation.message!);
      setUiState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const cart = safeJsonParse(localStorage.getItem("cart") || "[]");
    const selectedColor = variantState.selected?.color || dynamicProductDetails.color;
    const selectedSize = variantState.selected?.size || dynamicProductDetails.size;
    
    // Create a unique variant identifier for better duplicate detection
    const createVariantKey = (productId: string, userId: string, color: string, size: string, innerSlug: string, innerSubSlug: string) => {
      return `${productId}-${userId}-${color || 'no-color'}-${size || 'no-size'}-${innerSlug || 'no-slug'}-${innerSubSlug || 'no-subslug'}`;
    };
    
    const currentVariantKey = createVariantKey(
      product.data._id,
      auth.user._id,
      selectedColor,
      selectedSize,
      variantState.innerSlug,
      variantState.innerSubSlug
    );
    
    const existingCartItem = cart.find((item: any) => {
      const itemVariantKey = createVariantKey(
        item.productId,
        item.userId,
        item.color,
        item.size,
        item.innerSlug,
        item.innerSubSlug
      );
      return itemVariantKey === currentVariantKey;
    });

    if (existingCartItem) {
      toast.error("This product with selected variant is already in your cart.");
      setUiState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const totalPrice = variantState.price ?? dynamicProductDetails.finalPrice ?? product.data.discountPrice ?? product.data.price;
    const stockQuantityToUse = variantState.stock ?? product.data.stockQuantity;

    const cartItem = {
      userId: auth.user._id,
      productId: product.data._id,
      quantity: cartQuantity,
      name: product.data.name,
      price: totalPrice,
      sellerEmail: product?.data?.sellerEmail,
      sellerName: product?.data?.sellerName,
      stockQuantity: stockQuantityToUse,
      productImages: dynamicProductDetails.images,
      color: selectedColor,
      size: selectedSize,
      sku: dynamicProductDetails.sku,
      innerSlug: variantState.innerSlug,
      innerSubSlug: variantState.innerSubSlug,
    };

    cart.push(cartItem);
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      setStockQuantity(prev => prev - cartQuantity);
      toast.success("Added to cart!");
    } catch (error) {
      console.error('Error saving cart:', error);
      toast.error('Error saving to cart');
    }
    setUiState(prev => ({ ...prev, isLoading: false }));
  }, [uiState.isLoading, getUserAndToken, validateVariantSelection, safeJsonParse, product.data, dynamicProductDetails, variantState, cartQuantity]);

  const handleBuyNow = useCallback(() => {
    const auth = getUserAndToken();
    if (!auth) return;

    const validation = validateVariantSelection();
    if (!validation.isValid) {
      toast.error(validation.message!);
      return;
    }

    const priceToUse = variantState.price ?? dynamicProductDetails.finalPrice ?? product.data.discountPrice ?? product.data.price;
    const stockToUse = variantState.stock ?? product.data.stockQuantity;
    const selectedColor = variantState.selected?.color || dynamicProductDetails.color;
    const selectedSize = variantState.selected?.size || dynamicProductDetails.size;

    const cartItem = {
      userId: auth.user._id,
      productId: product.data._id,
      quantity: cartQuantity,
      name: product.data.name,
      price: priceToUse,
      sellerEmail: product?.data?.sellerEmail,
      sellerName: product?.data?.sellerName,
      stockQuantity: stockToUse,
      productImages: dynamicProductDetails.images,
      color: selectedColor,
      size: selectedSize,
      sku: dynamicProductDetails.sku,
      innerSlug: variantState.innerSlug,
      innerSubSlug: variantState.innerSubSlug,
    };

    const cart = safeJsonParse(localStorage.getItem("cart") || "[]");
    
    // Create a unique variant identifier for better duplicate detection
    const createVariantKey = (productId: string, userId: string, color: string, size: string, innerSlug: string, innerSubSlug: string) => {
      return `${productId}-${userId}-${color || 'no-color'}-${size || 'no-size'}-${innerSlug || 'no-slug'}-${innerSubSlug || 'no-subslug'}`;
    };
    
    const currentVariantKey = createVariantKey(
      product.data._id,
      auth.user._id,
      selectedColor,
      selectedSize,
      variantState.innerSlug,
      variantState.innerSubSlug
    );
    
    const existingCartItem = cart.find((item: any) => {
      const itemVariantKey = createVariantKey(
        item.productId,
        item.userId,
        item.color,
        item.size,
        item.innerSlug,
        item.innerSubSlug
      );
      return itemVariantKey === currentVariantKey;
    });

    if (!existingCartItem) {
      cart.push(cartItem);
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        setStockQuantity(prev => prev - cartQuantity);
        toast.success("Added to cart!");
      } catch (error) {
        console.error('Error saving cart:', error);
        toast.error('Error saving to cart');
        return;
      }
    }

    router.push("/cart/checkout");
  }, [getUserAndToken, validateVariantSelection, variantState, cartQuantity, product.data, dynamicProductDetails, safeJsonParse, router]);

  const handleLikeReview = useCallback(async (reviewId: string) => {
    const auth = getUserAndToken();
    if (!auth) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl || !validateApiUrl(baseUrl)) {
        toast.error('Service unavailable');
        return;
      }

      const { data } = await axios.post(
        `${baseUrl}/reviews/like/${encodeURIComponent(reviewId)}`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      toast.success("✨ Your feedback has been recorded! Thanks for engaging! 💖");
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId ? { ...review, likes: data.data.likes } : review
        )
      );
    } catch (error) {
      console.error('Like review error:', error);
      toast.error("Error toggling like for the review.");
    }
  }, [getUserAndToken]);

  const handleReplyReview = useCallback(async (reviewId: string, replyComment: string) => {
    const auth = getUserAndToken();
    if (!auth) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl || !validateApiUrl(baseUrl)) {
        toast.error('Service unavailable');
        return;
      }

      const { data } = await axios.post(
        `${baseUrl}/reviews/reply/${encodeURIComponent(reviewId)}`,
        { reply: replyComment, userName: auth.user.name },
        { headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" } }
      );

      toast.success("Replied to the review!");
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? {
                ...review,
                replies: [
                  ...review.replies,
                  {
                    _id: data.newReply?._id,
                    userId: auth.user._id,
                    userName: auth.user.name,
                    comment: replyComment,
                    timestamp: new Date().toISOString(),
                    isEditing: false,
                  },
                ],
              }
            : review
        )
      );
    } catch (error) {
      console.error('Reply review error:', error);
      toast.error("Error replying to the review.");
    }
  }, [getUserAndToken]);

  const handleDeleteReply = useCallback(async (reviewId: string, replyId: string) => {
    const auth = getUserAndToken();
    if (!auth) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl || !validateApiUrl(baseUrl)) {
        toast.error('Service unavailable');
        return;
      }

      await axios.delete(
        `${baseUrl}/reviews/delete-reply/${encodeURIComponent(reviewId)}/${encodeURIComponent(replyId)}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      toast.success("Reply deleted successfully!");
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? { ...review, replies: review.replies.filter(r => r._id !== replyId) }
            : review
        )
      );
    } catch (error) {
      console.error('Delete reply error:', error);
      toast.error("Error deleting the reply. Please refresh the page and try again.");
    }
  }, [getUserAndToken]);

  const onUpdateReply = useCallback((reviewId: string, replyId: string, updatedComment: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review._id === reviewId
          ? {
              ...review,
              replies: review.replies.map(reply =>
                reply._id === replyId ? { ...reply, comment: updatedComment } : reply
              ),
            }
          : review
      )
    );
  }, []);

  return (
    <>
      {uiState.isLoading ? (
        <ProductDetailsSkeleton></ProductDetailsSkeleton>
      ) : (
        <main>
          <div className="product-details pt-6 mt-4 flex flex-col gap-6 px-4 sm:px-6 lg:px-12 w-full">
            <Toaster
              position="top-center"
              gutter={10}
              containerStyle={{
                top: "70px",
                zIndex: 9999,
              }}
              reverseOrder={false}
            />


            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Images Gallery */}
              <div className="w-full lg:w-1/2 flex flex-col">
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="w-full mb-4 max-w-[600px]">
                    <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-lg shadow-md group">
                      <Image
                        src={selectedImage}
                        alt={product.data.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain transition-all duration-300 cursor-zoom-in"
                        unoptimized={true}
                        onError={(e) => {
                          // If current image fails, try to use another available image
                          const target = e.target as HTMLImageElement;
                          const allAvailableImages = [...(product.data.productImages || [])];
                          const nextImage = allAvailableImages.find(img => img !== target.src);
                          if (nextImage && target.src !== nextImage) {
                            target.src = nextImage;
                            setSelectedImage(nextImage);
                          }
                        }}
                        onClick={() => setUiState(prev => ({ ...prev, showImageModal: true }))}
                      />
                      <button
                        onClick={() => setUiState(prev => ({ ...prev, showImageModal: true }))}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiMagnifyingGlassPlus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  {/* Thumbnails for the Gallery */}
                  <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={image}
                        alt={product.data.name}
                        className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer border transition-all duration-300 flex-shrink-0 ${
                          selectedImage === image
                            ? "border-orange-600"
                            : "border-gray-300"
                        }`}
                        onError={(e) => {
                          // If image fails to load, try to find another available image
                          const target = e.target as HTMLImageElement;
                          const allAvailableImages = [...(product.data.productImages || [])];
                          const currentIndex = allAvailableImages.indexOf(target.src);
                          const nextImage = allAvailableImages.find((img, idx) => idx !== currentIndex && img !== target.src);
                          if (nextImage && target.src !== nextImage) {
                            target.src = nextImage;
                          }
                        }}
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Product Information Section */}
                <div className="mt-6 space-y-4 lg:block hidden">
                  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Product Information</h4>
                    <div className="space-y-3">
                    {longDesc && (
                      <div className="mb-4 pb-3 border-b border-gray-200">
                        <span className="font-semibold">Description:</span>
                        <p className="text-base text-gray-600 leading-relaxed whitespace-pre-wrap mt-1">
                          {displayDesc}
                        </p>
                        {isLong && (
                          <button
                            onClick={() => setUiState(prev => ({ ...prev, showFullDescription: !prev.showFullDescription }))}
                            className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
                          >
                            {uiState.showFullDescription ? "See less ▲" : "See more ▼"}
                          </button>
                        )}
                      </div>
                    )}
                    {product.data.brand && product.data.brand.trim() !== "" && (
                      <div className="flex gap-2">
                        <span className="font-semibold">Brand:</span>
                        <span>{product.data.brand}</span>
                      </div>
                    )}

                    {product.data.materials && (
                      <div className="flex gap-2">
                        <span className="font-semibold">Materials:</span>
                        <span>{product.data.materials}</span>
                      </div>
                    )}



                    {product.data.warranty && (
                      <div className="flex gap-2">
                        <span className="font-semibold">Warranty:</span>
                        <span>{product.data.warranty}</span>
                      </div>
                    )}

                    {product.data.tags &&
                      product.data.tags.some((tag) => tag.trim() !== "") && (
                        <div className="flex gap-2">
                          <span className="font-semibold">Tags:</span>
                          <span>
                            {product.data.tags
                              .filter((tag) => tag.trim() !== "")
                              .join(", ")}
                          </span>
                        </div>
                      )}

                    {(product.data.addedBy || product.data.sellerName) && (
                      <div className="flex gap-2">
                        <span className="font-semibold">Seller:</span>
                        <span>{product.data.addedBy || product.data.sellerName}</span>
                      </div>
                    )}

                    </div>

                  </div>
                  
                  {/* Shipping Information */}
                  {(product.data.freeShipping || product.data.weight || product.data.dimensions || product.data.returnPolicy) && (
                    <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">🚚 Shipping & Returns</h3>
                      <div className="space-y-2">
                        {product.data.freeShipping && (
                          <div className="flex items-center gap-2 text-green-600">
                            <span>✓ Free shipping on this item</span>
                          </div>
                        )}
                        {dynamicProductDetails.weight && (
                          <div className="flex gap-2">
                            <span className="font-medium">Weight:</span>
                            <span>{dynamicProductDetails.weight} grams</span>
                          </div>
                        )}
                        {product.data.dimensions && (
                          <div className="flex gap-2">
                            <span className="font-medium">Dimensions:</span>
                            <span>{product.data.dimensions}</span>
                          </div>
                        )}
                        {product.data.returnPolicy && (
                          <div className="flex gap-2">
                            <span className="font-medium">Return Policy:</span>
                            <span>{product.data.returnPolicy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col gap-4">
                  {/* Product Name */}
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">{product.data.name}</h1>

                  {/* Store Name and Brand */}
                  <div className="flex flex-row justify-between items-center gap-2 text-sm text-gray-600">
                    <a 
                      href={sellerData.profile?.brand?.slug ? `/stores/${sellerData.profile.brand.slug}` : '#'} 
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Visit the {sellerData.profile?.brand?.name || product.data.sellerName || 'MirexaStore'}
                    </a>
                    {product.data.brand && brandLogo && (
                      <div className="flex items-center gap-2">
                        <span>Brand:</span>
                        <img 
                          src={brandLogo} 
                          alt={product.data.brand} 
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Rating Display */}
                  {(product.data.rating || product.data.averageRating || reviews.length > 0) && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(product.data.averageRating || product.data.rating || (reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {(product.data.averageRating || product.data.rating || (reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0)).toFixed(1)} ({product.data.totalReviews || reviews.length} reviews)
                      </span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {/* Price, Stock, Wishlist Row */}
                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex flex-row items-center gap-2 sm:gap-4">
                        <div className="flex items-start gap-1 sm:gap-2">
                          {/* Base Price (crossed out) */}
                          {dynamicProductDetails.basePrice > dynamicProductDetails.finalPrice && (
                            <span className="text-sm sm:text-lg text-gray-500 line-through">
                              ₹{Math.round(dynamicProductDetails.basePrice)}
                            </span>
                          )}
                          {/* Final Price and Discount */}
                          <div className="flex items-start">
                            <span className="text-lg sm:text-2xl font-semibold text-orange-600">
                              ₹{Math.round(cartQuantity >= 10 ? getBulkPricing(cartQuantity) : currentPrice)}
                            </span>
                            {dynamicProductDetails.discount > 0 && (
                              <span className="text-xs text-red-600 font-medium ml-1">
                                {dynamicProductDetails.discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-green-600">
                          {currentStock > 0 ? `${currentStock} in stock` : <span className="text-red-600">Out of stock</span>}
                          {currentStock <= (product.data.lowStockThreshold || 10) && currentStock > 0 && (
                            <span className="ml-1 sm:ml-2 text-orange-600 font-semibold">(Low Stock!)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={handleWishlistToggle}
                          className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          {uiState.isWishlisted ? (
                            <HiHeart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                          ) : (
                            <HiOutlineHeart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    {cartQuantity >= 10 && (
                      <span className="text-sm text-green-600 font-medium">
                        (Bulk Price Applied!)
                      </span>
                    )}
                  </div>

                  <div className="text-base text-gray-700 whitespace-pre-line mb-4">
                    {dynamicProductDetails.description}
                  </div>



                  {/* Quantity, Share, Compare Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-700">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={cartQuantity <= 1}
                        >
                          <HiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[60px] text-center">{cartQuantity}</span>
                        <button
                          onClick={() => setCartQuantity(Math.min(currentStock, cartQuantity + 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={cartQuantity >= currentStock}
                        >
                          <HiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUiState(prev => ({ ...prev, showShareModal: true }))}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <HiShare className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                      </button>
                      <button
                        onClick={handleAddToCompare}
                        className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                      >
                        Compare
                      </button>
                    </div>
                  </div>

                  {/* Variants */}
                  {product.data.variants &&
                  (product.data.variants.some((v) => v.color) ||
                    product.data.variants.some((v) => v.size)) ? (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">
                        Select Variants
                      </h4>
                      
                      {/* Slug and SubSlug Dropdowns in Row */}
                      {product.data.variants && product.data.variants.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Inner Slug Dropdown */}
                          {product.data.variants && [...new Set(product.data.variants.map(v => v.innerSlug).filter(Boolean))].length > 0 && (
                            <div>
                              <label className="block text-sm font-bold text-gray-800 mb-1">
                                {product.data.slug?.name ? product.data.slug.name.charAt(0).toUpperCase() + product.data.slug.name.slice(1) : 'Slug'}
                              </label>
                              <select 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={variantState.innerSlug}
                                onChange={(e) => handleInnerSlugChange(e.target.value)}
                              >
                                <option value="">Select Slug</option>
                                {[...new Set(product.data.variants.map(v => v.innerSlug).filter(Boolean))].map((innerSlug, index) => (
                                  <option key={index} value={innerSlug}>
                                    {innerSlug}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          {/* Inner SubSlug Dropdown */}
                          {variantState.innerSlug && product.data.variants && (() => {
                            const availableSubSlugs = [...new Set(product.data.variants.filter(v => v.innerSlug === variantState.innerSlug).map(v => v.innerSubSlug).filter(Boolean))] as string[];
                            return availableSubSlugs.length > 0 && (
                              <div>
                                <label className="block text-sm font-bold text-gray-800 mb-1">
                                  {product.data.subSlug?.name ? product.data.subSlug.name.charAt(0).toUpperCase() + product.data.subSlug.name.slice(1) : 'SubSlug'}
                                </label>
                                <select 
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  value={variantState.innerSubSlug}
                                  onChange={(e) => handleInnerSubSlugChange(e.target.value)}
                                >
                                  {availableSubSlugs.map((innerSubSlug, index) => (
                                    <option key={index} value={innerSubSlug}>
                                      {innerSubSlug}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Color Options - show all colors from arrays */}
                        {product.data.variants && (() => {
                          const availableVariants = variantState.innerSlug 
                            ? product.data.variants.filter(v => v.innerSlug === variantState.innerSlug && (!variantState.innerSubSlug || v.innerSubSlug === variantState.innerSubSlug))
                            : product.data.variants;
                          
                          // Get all unique colors from all variants (both single color and color arrays)
                          const allColors = new Set<string>();
                          availableVariants.forEach(variant => {
                            if (Array.isArray(variant.color)) {
                              variant.color.forEach(color => color && allColors.add(color));
                            } else if (variant.color) {
                              allColors.add(variant.color);
                            }
                          });
                          
                          return allColors.size > 0 && (
                            <div>
                              <h5 className="font-semibold mb-2">Color</h5>
                              <div className="flex flex-wrap gap-2">
                                {Array.from(allColors).map((color, index) => (
                                  <label
                                    key={index}
                                    className={`cursor-pointer w-8 h-8 border rounded-full transition-all ${
                                      variantState.selected?.color === color
                                        ? "border-orange-600 ring-2 ring-orange-500"
                                        : "border-gray-300 hover:ring-1 hover:ring-orange-200"
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleVariantChange("color", color)}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Size Options - show all sizes from arrays */}
                        {product.data.variants && (() => {
                          const availableVariants = variantState.innerSlug 
                            ? product.data.variants.filter(v => v.innerSlug === variantState.innerSlug && (!variantState.innerSubSlug || v.innerSubSlug === variantState.innerSubSlug))
                            : product.data.variants;
                          
                          // Get all unique sizes from all variants (both single size and size arrays)
                          const allSizes = new Set<string>();
                          availableVariants.forEach(variant => {
                            if (Array.isArray(variant.size)) {
                              variant.size.forEach(size => size && allSizes.add(size));
                            } else if (variant.size) {
                              allSizes.add(variant.size);
                            }
                          });
                          
                          return allSizes.size > 0 && (
                            <div>
                              <h5 className="font-semibold mb-2">Size</h5>
                              <div className="flex flex-wrap gap-2">
                                {Array.from(allSizes).map((size, index) => (
                                  <label
                                    key={index}
                                    className={`cursor-pointer px-3 py-1 border rounded transition-all ${
                                      variantState.selected?.size === size
                                        ? "bg-orange-600 text-white border-orange-600"
                                        : "border-gray-300 hover:bg-orange-100"
                                    }`}
                                    onClick={() => handleVariantChange("size", size)}
                                  >
                                    {size}
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      This product comes as-is, with no selectable options. Just
                      add it to your cart and enjoy your purchase!
                    </p>
                  )}

                  {/* Out of Stock Alert */}
                  {currentStock === 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium mb-3">This item is currently out of stock</p>
                      <button
                        onClick={() => setUiState(prev => ({ ...prev, showStockAlert: true }))}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Notify When Available
                      </button>
                    </div>
                  )}

                  {/* Combined Specifications */}
                  {dynamicProductDetails.specifications && Array.isArray(dynamicProductDetails.specifications) && dynamicProductDetails.specifications.length > 0 && (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Specifications</h3>
                      <div className="space-y-2">
                        {dynamicProductDetails.specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                            <span className="font-medium text-gray-700">{spec.key}:</span>
                            <span className="text-gray-600">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Offers */}
                  <AvailableOffers />
                  {product?.data?.type === "affiliate" && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm mb-4">
                      <strong>Disclaimer:</strong> This product contains
                      affiliate links. We may earn a small commission if you
                      make a purchase through our link — at no extra cost to
                      you.
                    </div>
                  )}
                  {/* Bulk Pricing */}
                  {cartQuantity >= 10 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">💰 Bulk Pricing</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>10-19 items:</span>
                          <span className="font-medium">₹{Math.round(getBulkPricing(10))} each (5% off)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>20-49 items:</span>
                          <span className="font-medium">₹{Math.round(getBulkPricing(20))} each (10% off)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>50+ items:</span>
                          <span className="font-medium">₹{Math.round(getBulkPricing(50))} each (15% off)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Estimator */}
                  <DeliveryEstimator />

                  {/* Video Player */}
                  {product.data.videoUrl && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Product Video</h4>
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <video
                          controls
                          className="w-full h-full object-cover"
                          poster={product.data.productImages[0]}
                        >
                          <source src={product.data.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}

                  {/* Add to Cart & Buy Now Buttons */}
                  <div className="hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                    {product.data.type === "affiliate" ? (
                      <a
                        href={product.data.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-green-600 text-white text-center font-semibold rounded-md transition-all duration-300 hover:bg-green-700"
                      >
                        Buy Now
                      </a>
                    ) : (
                      <>
                        <button
                          onClick={handleAddToCart}
                          disabled={uiState.isLoading || currentStock <= 0}
                          className={`w-full py-3 bg-orange-600 text-white font-semibold rounded-md transition-all duration-300 ${
                            uiState.isLoading || currentStock <= 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-orange-700"
                          }`}
                        >
                          {uiState.isLoading ? "Adding..." : "Add to Cart"}
                        </button>
                        <button
                          onClick={handleBuyNow}
                          disabled={uiState.isLoading || currentStock <= 0}
                          className={`w-full py-3 bg-green-600 text-white font-semibold rounded-md transition-all duration-300 ${
                            uiState.isLoading || currentStock <= 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-green-700"
                          }`}
                        >
                          {uiState.isLoading ? "Processing..." : "Buy Now"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Product Information Section */}
            <div className="lg:hidden mt-6 space-y-4">
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Product Information</h4>
                <div className="space-y-3">
                {longDesc && (
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <span className="font-semibold">Description:</span>
                    <p className="text-base text-gray-600 leading-relaxed whitespace-pre-wrap mt-1">
                      {displayDesc}
                    </p>
                    {isLong && (
                      <button
                        onClick={() => setUiState(prev => ({ ...prev, showFullDescription: !prev.showFullDescription }))}
                        className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
                      >
                        {uiState.showFullDescription ? "See less ▲" : "See more ▼"}
                      </button>
                    )}
                  </div>
                )}
                {product.data.brand && product.data.brand.trim() !== "" && (
                  <div className="flex gap-2">
                    <span className="font-semibold">Brand:</span>
                    <span>{product.data.brand}</span>
                  </div>
                )}
                {product.data.materials && (
                  <div className="flex gap-2">
                    <span className="font-semibold">Materials:</span>
                    <span>{product.data.materials}</span>
                  </div>
                )}
                {product.data.warranty && (
                  <div className="flex gap-2">
                    <span className="font-semibold">Warranty:</span>
                    <span>{product.data.warranty}</span>
                  </div>
                )}
                {product.data.tags && product.data.tags.some((tag) => tag.trim() !== "") && (
                  <div className="flex gap-2">
                    <span className="font-semibold">Tags:</span>
                    <span>{product.data.tags.filter((tag) => tag.trim() !== "").join(", ")}</span>
                  </div>
                )}
                {(product.data.addedBy || product.data.sellerName) && (
                  <div className="flex gap-2">
                    <span className="font-semibold">Seller:</span>
                    <span>{product.data.addedBy || product.data.sellerName}</span>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <TrustIndicators />

            {/* seller profile */}

            {sellerData.profile && (
              <SellerProfileCard
                sellerProfile={sellerData.profile}
                sellerRating={sellerData.rating}
                isFollowing={sellerData.isFollowing}
                followersCount={sellerData.followersCount}
                handleFollowToggle={handleFollowToggle}
              />
            )}



            {/* Additional Information */}
            {(product?.data?.notes ||
              (Array.isArray(product.data.features) &&
                product.data.features.length > 0)) && (
              <div className="text-gray-700 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                {product?.data?.notes && (
                  <section className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      📝 Notes
                    </h4>
                    <p className="text-base text-gray-600">
                      {product.data.notes}
                    </p>
                  </section>
                )}

                {Array.isArray(product.data.features) &&
                  product.data.features.length > 0 && (
                    <section className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        🔍 Key Features
                      </h4>
                      <ul className="list-none space-y-2">
                        {product.data.features.map(
                          (feature: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start text-base text-gray-600"
                            >
                              <span className="mr-2 mt-1 text-green-500">
                                ✅
                              </span>
                              <span>{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </section>
                  )}
              </div>
            )}
            
            {/* Related Products */}
            <RelatedProducts products={relatedProducts?.data || []} />
            
            {/* Product Q&A */}
            <ProductQA productId={product.data._id} />
            
            {/* Recently Viewed Products */}
            <RecentlyViewed />
          </div>

          <div className="pt-8 w-full px-4 sm:px-6 lg:px-12">
            <ReviewsSection
              reviews={reviews}
              setReviews={setReviews}
              onLikeReview={handleLikeReview}
              onReplyReview={handleReplyReview}
              onDeleteReply={handleDeleteReply}
              onUpdateReply={onUpdateReply}
            />
          </div>

          {/* Image Modal */}
          {uiState.showImageModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl max-h-full">
                <button
                  onClick={() => setUiState(prev => ({ ...prev, showImageModal: false }))}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors z-10"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
                <Image
                  src={selectedImage}
                  alt={product.data.name}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Share Modal */}
          {uiState.showShareModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Share Product</h3>
                  <button
                    onClick={() => setUiState(prev => ({ ...prev, showShareModal: false }))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stock Alert Modal */}
          {uiState.showStockAlert && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Stock Alert</h3>
                  <button
                    onClick={() => setUiState(prev => ({ ...prev, showStockAlert: false }))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  Enter your email to get notified when {product.data.name} is back in stock.
                </p>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setUiState(prev => ({ ...prev, showStockAlert: false }))}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStockAlert}
                    className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Sticky Add to Cart */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:hidden z-40">
            <div className="flex gap-2">
              {product.data.type === "affiliate" ? (
                <a
                  href={product.data.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-green-600 text-white text-center font-semibold rounded-md text-sm"
                >
                  Buy Now
                </a>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={uiState.isLoading || currentStock <= 0}
                    className="flex-1 py-3 bg-orange-600 text-white font-semibold rounded-md disabled:opacity-50 text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={uiState.isLoading || currentStock <= 0}
                    className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-md disabled:opacity-50 text-sm"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      )}

      <FloatingIcons
        sellerNumber={sellerData.profile?.brand?.whatsapp}
        phone={sellerData.profile?.brand?.phone}
      />
    </>
  );
};

export default ProductDetails;
