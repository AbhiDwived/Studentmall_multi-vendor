/**
 * Utility functions for handling product data transformations
 */

export interface DatabaseProduct {
  _id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  finalPrice?: number;
  stockQuantity: number;
  category: string;
  brand?: string;
  materials?: string;
  specifications?: Array<{
    _id?: string;
    key: string;
    value: string;
  }>;
  sku?: string;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  viewCount?: number;
  wishlistCount?: number;
  relatedProducts?: string[];
  freeShipping?: boolean;
  returnPolicy?: string;
  slug?: string | { _id: string; name?: string; slug?: string };
  subSlug?: string | { _id: string; name?: string; slug?: string };
  urlSlug?: string;
  type?: 'own' | 'affiliate';
  affiliateLink?: string;
  tags?: string[];
  variants?: Array<{
    _id?: string;
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
    specification?: Array<{
      _id?: string;
      key: string;
      value: string;
    }>;
    sku?: string;
    price?: number;
    images?: string[];
    weight?: number;
  }>;
  productImages: string[];
  videoUrl?: string;
  deliveryCharges?: any[];
  defaultDeliveryCharge?: number;
  packingStandard?: string;
  reviews?: string[];
  rating?: number;
  totalReviews?: number;
  averageRating?: number;
  status?: 'active' | 'inactive' | 'draft';
  isFeatured?: boolean;
  isNewArrival?: boolean;
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerNumber?: number;
  features?: string[];
  notes?: string;
  weight?: number;
  dimensions?: string;
  warranty?: string;
  deletedBy?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/**
 * Calculate the correct discount percentage from database values
 */
export const calculateDiscountPercentage = (
  price: number,
  discountPrice?: number,
  discountPercentage?: number
): number => {
  // Use discountPercentage from database if available
  if (discountPercentage && discountPercentage > 0) {
    return Math.round(discountPercentage);
  }
  // Fallback to calculating from discountPrice
  if (discountPrice && price > discountPrice) {
    return Math.round(((price - discountPrice) / price) * 100);
  }
  return 0;
};

/**
 * Calculate the final price from database values
 */
export const calculateFinalPrice = (
  price: number,
  discountPrice?: number,
  discountPercentage?: number,
  finalPrice?: number
): number => {
  // Use finalPrice from database if available
  if (finalPrice && finalPrice > 0) {
    return Math.round(finalPrice * 100) / 100;
  }
  // Use discountPrice if available
  if (discountPrice && discountPrice > 0) {
    return Math.round(discountPrice * 100) / 100;
  }
  // Calculate from discountPercentage
  if (discountPercentage && discountPercentage > 0) {
    return Math.round((price - (price * discountPercentage / 100)) * 100) / 100;
  }
  return price;
};

/**
 * Normalize slug data from database (handles both ObjectId and string formats)
 */
export const normalizeSlug = (slug?: string | { _id: string; name?: string; slug?: string }): string => {
  if (!slug) return '';
  if (typeof slug === 'string') return slug;
  return slug.slug || slug.name || slug._id || '';
};

/**
 * Transform database product to frontend format
 */
export const transformDatabaseProduct = (dbProduct: DatabaseProduct): any => {
  const discountPercentage = calculateDiscountPercentage(
    dbProduct.price,
    dbProduct.discountPrice,
    dbProduct.discountPercentage
  );
  
  const finalPrice = calculateFinalPrice(
    dbProduct.price,
    dbProduct.discountPrice,
    dbProduct.discountPercentage,
    dbProduct.finalPrice
  );

  return {
    ...dbProduct,
    slug: normalizeSlug(dbProduct.slug),
    subSlug: normalizeSlug(dbProduct.subSlug),
    discountPercentage,
    finalPrice,
    // Ensure backward compatibility
    discountPrice: discountPercentage > 0 ? finalPrice : undefined,
  };
};

/**
 * Validate product data consistency
 */
export const validateProductData = (product: DatabaseProduct): string[] => {
  const errors: string[] = [];
  
  // Check price consistency
  if (product.discountPercentage && product.finalPrice) {
    const expectedFinalPrice = product.price - (product.price * product.discountPercentage / 100);
    const priceDifference = Math.abs(expectedFinalPrice - product.finalPrice);
    if (priceDifference > 0.01) {
      errors.push(`Price calculation mismatch: Expected ${expectedFinalPrice.toFixed(2)}, got ${product.finalPrice.toFixed(2)}`);
    }
  }
  
  // Check discount price vs final price
  if (product.discountPrice && product.finalPrice) {
    const priceDifference = Math.abs(product.discountPrice - product.finalPrice);
    if (priceDifference > 0.01) {
      errors.push(`Discount price and final price mismatch: discountPrice=${product.discountPrice}, finalPrice=${product.finalPrice}`);
    }
  }
  
  // Check required fields
  if (!product.name?.trim()) {
    errors.push('Product name is required');
  }
  
  if (!product.description?.trim()) {
    errors.push('Product description is required');
  }
  
  if (product.price <= 0) {
    errors.push('Product price must be greater than 0');
  }
  
  if (product.stockQuantity < 0) {
    errors.push('Stock quantity cannot be negative');
  }
  
  return errors;
};