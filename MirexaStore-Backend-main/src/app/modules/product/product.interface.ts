import { Document, Types } from 'mongoose';

export type TProduct = {
	// Basic Fields
	name: string;
	description: string;
	longDescription?: string;
	price: number;
	discount?: number;
	discountPrice?: number;
	discountPercentage?: number;
	finalPrice?: number;
	stockQuantity: number;
	category: string;
	brand?: string;
	materials?: string;
	specifications?: Array<{
		key: string;
		value: string;
	}>;

	// ✅ Essential E-commerce Fields
	sku?: string;
	lowStockThreshold?: number;
	trackInventory?: boolean;
	viewCount?: number;
	wishlistCount?: number;
	relatedProducts?: Types.ObjectId[];
	freeShipping?: boolean;
	returnPolicy?: string;
	packingStandard?: string;

	// ✅ Slug / SEO
	slug?: Types.ObjectId;
	subSlug?: Types.ObjectId;
	urlSlug?: string;

	// ✅ Product Type
	type: 'own' | 'affiliate';
	affiliateLink?: string;

	tags?: string[];

	// ✅ Enhanced Variants (Reference Model Structure)
	variants?: Array<{
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
			key: string;
			value: string;
		}>;
// Additional enhanced fields
		sku?: string;
		price?: number;
		images?: string[];
		weight?: number;
	}>;

	// ✅ Images and Media
	productImages: string[];
	videoUrl?: string;

	// ✅ Delivery Charges
	deliveryCharges?: Array<{
		division: string;
		district: string;
		charge: number;
	}>;
	defaultDeliveryCharge?: number;

	// ✅ Reviews & Ratings
	reviews?: Types.ObjectId[];
	rating?: number;
	totalReviews?: number;

	// Product Status & Labels
	status?: 'active' | 'inactive' | 'draft';
	isFeatured?: boolean;
	isNewArrival?: boolean;

	// ✅ Seller Info
	sellerId?: Types.ObjectId;
	sellerName?: string;
	sellerEmail?: string;
	sellerNumber?: number;

	// ✅ Optional Details
	features?: string[];
	notes?: string;

	// ✅ Shipping Information
	weight?: number;
	dimensions?: string;
	warranty?: string;

	// ✅ Deletion Flags
	deletedBy?: 'admin' | 'seller' | null;
	isDeleted?: boolean;

} & Document;
