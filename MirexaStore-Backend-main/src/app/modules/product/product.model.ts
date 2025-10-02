import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

// ✅ URL Validation Function
function arrayOfValidUrls(value: string[]): boolean {
	return value.every((url) => /^https?:\/\//.test(url));
}

// ✅ Product Schema
const productSchema = new Schema<TProduct>(
	{
		// Basic Fields
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		longDescription: { type: String },
		price: { type: Number, required: true, min: 0 },
		discount: { type: Number },
		discountPrice: { type: Number, min: 0 },
		discountPercentage: { type: Number, min: 0, max: 100 },
		finalPrice: { type: Number, min: 0 },
		stockQuantity: { type: Number, required: true, min: 0, default: 0 },
		category: { type: String, required: true, trim: true },
		brand: { type: String, trim: true },
		materials: { type: String, trim: true },
		
		specifications: [
			{
				key: { type: String, trim: true },
				value: { type: String, trim: true },
			},
		],

		// ✅ Essential E-commerce Fields
		sku: { type: String, unique: true, trim: true, sparse: true },
		lowStockThreshold: { type: Number, default: 10, min: 0 },
		trackInventory: { type: Boolean, default: true },
		viewCount: { type: Number, default: 0, min: 0 },
		wishlistCount: { type: Number, default: 0, min: 0 },
		relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		freeShipping: { type: Boolean, default: false },
		returnPolicy: { type: String, trim: true },
		packingStandard: { type: String, trim: true },

		// ✅ Slug / SEO
		slug: { type: Schema.Types.ObjectId, ref: 'Slug', required: false },
		subSlug: { type: Schema.Types.ObjectId, ref: 'SubSlug', required: false },
		urlSlug: { type: String, trim: true, index: true },

		// ✅ Product Type
		type: {
			type: String,
			enum: ['own', 'affiliate'],
			required: true,
			default: 'own',
		},
		affiliateLink: { type: String },

		tags: { type: [String], default: [] },

		// ✅ Enhanced Variants
		variants: [
			{
				innerSlug: { type: String, required: false },
				innerSubSlug: { type: String, required: false },
				color: { type: [String], default: [] }, // Multiple colors as array
				size: { type: [String], default: [] }, // Multiple sizes as array
				baseprice: { type: Number, required: true },
				discount: { type: Number },
				finalprice: { type: Number, required: true },
				stock: { type: Number, default: 0 },
				description: { type: String, default: 'This is a sample variant description' },
				variantDescription: { type: String, default: '' },
				specification: [
					{
						key: String,
						value: String,
					},
				],
				sku: { type: String, trim: true },
				price: { type: Number, min: 0 },
				images: {
					type: [String],
					default: [],
					validate: {
						validator: function(value: string[]) {
							return value.length === 0 || arrayOfValidUrls(value);
						},
						message: 'Please provide valid URLs for variant images'
					}
				},
				weight: { type: Number, default: 0, min: 0 },
			},
		],

		// ✅ Images and Media
		productImages: {
			type: [String],
			required: true,
			validate: [arrayOfValidUrls, 'Please provide valid URLs for images'],
		},
		videoUrl: { type: String, trim: true },

		// ✅ Delivery Charges
		deliveryCharges: {
			type: [
				{
					division: { type: String, required: true, trim: true },
					district: { type: String, required: true, trim: true },
					charge: { type: Number, required: true, min: 0 },
				},
			],
			default: [],
		},
		defaultDeliveryCharge: { type: Number, default: 0, min: 0 },

		// ✅ Reviews & Ratings
		reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
		rating: { type: Number, default: 0, min: 0, max: 5 },
		totalReviews: { type: Number, default: 0 },

		// ✅ Status & Labels
		status: {
			type: String,
			enum: ['active', 'inactive', 'draft'],
			default: 'draft',
		},
		isFeatured: { type: Boolean, default: false },
		isNewArrival: { type: Boolean, default: false },

		// ✅ Seller Info
		sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
		sellerName: { type: String, trim: true },
		sellerEmail: { type: String, trim: true },
		sellerNumber: { type: Number, default: 0 },

		// ✅ Optional Details
		features: { type: [String], default: [] },
		notes: { type: String, trim: true },

		// ✅ Shipping Information
		weight: { type: Number, default: 0 },
		dimensions: { type: String, trim: true },
		warranty: { type: String, trim: true },

		// ✅ Deletion Flags
		deletedBy: {
			type: String,
			enum: ['admin', 'seller', null],
			default: null,
		},
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// ✅ Indexing
productSchema.index({ category: 1 });
productSchema.index({ 'variants.sku': 1 });
productSchema.index({ slug: 1 }, { sparse: true });
productSchema.index({ subSlug: 1 }, { sparse: true });
productSchema.index({ status: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });

// ✅ Create Model
const Product = model<TProduct>('Product', productSchema);
export default Product;
