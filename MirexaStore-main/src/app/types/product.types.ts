// Enhanced Product Types based on updated backend model

export interface Specification {
  key: string;
  value: string;
}

export interface Slug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status?: boolean;
}

export interface SubSlug {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentSlug: string;
  status?: boolean;
}

export interface ProductVariant {
  innerSlug?: string;
  innerSubSlug?: string;
  color: string;
  size: string;
  baseprice: number;
  discount?: number;
  finalprice: number;
  stock?: number;
  description?: string;
  variantDescription?: string;
  specification?: Specification[];
  sku?: string;
  price?: number;
  images?: string[];
  weight?: number;
}

export interface DeliveryCharge {
  division: string;
  district: string;
  charge: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  discount?: number;
  stockQuantity: number;
  category: string;
  brand?: string;
  materials?: string;
  specifications?: Specification[];

  // Essential E-commerce Fields
  sku?: string;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  viewCount?: number;
  wishlistCount?: number;
  relatedProducts?: Product[];
  freeShipping?: boolean;
  returnPolicy?: string;

  // Slug / SEO
  slug?: Slug;
  subSlug?: SubSlug;
  urlSlug?: string;

  // Product Type
  type: 'own' | 'affiliate';
  affiliateLink?: string;

  tags?: string[];

  // Variants
  variants?: ProductVariant[];

  // Images and Media
  productImages: string[];
  videoUrl?: string;

  // Delivery
  deliveryCharges?: DeliveryCharge[];
  defaultDeliveryCharge?: number;

  // Reviews and Ratings
  reviews?: string[];
  rating?: number;
  totalReviews?: number;
  averageRating?: number;

  // Status & Labels
  status?: 'active' | 'inactive' | 'draft';
  isFeatured?: boolean;
  isNewArrival?: boolean;

  // Seller Info
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerNumber?: number;

  // Optional Details
  features?: string[];
  notes?: string;

  // Shipping Information
  weight?: number;
  dimensions?: string;
  warranty?: string;

  // Deletion Flags
  deletedBy?: 'admin' | 'seller' | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Types
export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

// Form Types
export interface ProductFormData extends Omit<Product, '_id' | 'createdAt' | 'updatedAt'> {}

export interface VariantFormData extends Omit<ProductVariant, 'specifications'> {
  specifications?: { key: string; value: string }[];
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  freeShipping?: boolean;
}

// Search Types
export interface ProductSearchSuggestion {
  _id: string;
  name: string;
  sku?: string;
  slug?: Slug;
  productImages: string[];
  price: number;
  discountPrice?: number;
  category: string;
  metaTitle?: string;
}

export interface SearchResponse {
  success: boolean;
  data: ProductSearchSuggestion[];
}