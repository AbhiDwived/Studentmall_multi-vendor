// services/product.service.ts

import { Types } from "mongoose";
import { TProduct } from "./product.interface";
import Product from "./product.model";
import { sendEmail } from "../../utils/sendEmail";
import DOMPurify from 'isomorphic-dompurify';


const createProductIntoDb = async (productData: Partial<TProduct>) => {
	// Input validation and sanitization
	if (!productData || typeof productData !== 'object') {
		throw new Error('Invalid product data');
	}

	// Sanitize string fields to prevent XSS
	const sanitizedData = { ...productData };
	if (sanitizedData.name) {
		sanitizedData.name = DOMPurify.sanitize(sanitizedData.name.toString());
	}
	if (sanitizedData.description) {
		sanitizedData.description = DOMPurify.sanitize(sanitizedData.description.toString());
	}
	if (sanitizedData.longDescription) {
		sanitizedData.longDescription = DOMPurify.sanitize(sanitizedData.longDescription.toString());
	}

	// Auto-generate SKU if not provided
	if (!sanitizedData.sku) {
		sanitizedData.sku = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
	}
	
	// Handle slug field properly with proper typing
	const typedData = sanitizedData as any;
	if (typedData.slug) {
		if (typeof typedData.slug === 'string') {
			if (Types.ObjectId.isValid(typedData.slug)) {
				typedData.slug = new Types.ObjectId(typedData.slug);
			} else {
				delete typedData.slug;
			}
		}
	} else if (typedData.slug === null || typedData.slug === '') {
		delete typedData.slug;
	}
	
	// Handle subSlug field properly with proper typing
	if (typedData.subSlug) {
		if (typeof typedData.subSlug === 'string') {
			if (Types.ObjectId.isValid(typedData.subSlug)) {
				typedData.subSlug = new Types.ObjectId(typedData.subSlug);
			} else {
				delete typedData.subSlug;
			}
		}
	} else if (typedData.subSlug === null || typedData.subSlug === '') {
		delete typedData.subSlug;
	}
	
	const newProduct = new Product(typedData);
	try {
		await newProduct.save();
	} catch (error) {
		throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}

	// 🔔 Email to Seller
	if (newProduct.sellerEmail) {
		const sellerName = newProduct?.sellerName || 'Seller';
		const productName = newProduct?.name || 'your product';

		const subject = `📝 Product Submission Received: ${productName}`;
		const html = `
			<div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
				<h2>Hello ${sellerName},</h2>
				<p>Thank you for submitting <strong>${productName}</strong> to Mirexa Marketplace.</p>
				<p>✅ Your product is currently <strong>under review</strong> and will be reviewed by our admin team shortly.</p>
				<p>You’ll receive an email as soon as your product is approved and made live.</p>
				<br/>
				<p style="font-size: 14px; color: #888;">Regards,<br/>Mirexa Marketplace Team</p>
			</div>
		`;

		await sendEmail(newProduct?.sellerEmail, subject, html);
	}

	// 🔔 Email to Admin
	const adminEmail = 'abhidwivedi687@gmail.com';
	if (adminEmail) {
		const productName = newProduct?.name || 'a product';
		const sellerName = newProduct?.sellerName || 'Unknown Seller';
		const sellerEmail = newProduct?.sellerEmail || 'No Email';

		const subject = `🔔 New Product Pending Review: ${productName}`;
		const html = `
			<div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
				<h2>New Product Submission</h2>
				<p><strong>Product:</strong> ${productName}</p>
				<p><strong>Seller:</strong> ${sellerName}</p>
				<p><strong>Email:</strong> ${sellerEmail}</p>
				<p>Please review and approve this product from the admin dashboard.</p>
				<br/>
				<p style="font-size: 14px; color: #888;">System Notification – Mirexa Marketplace</p>
			</div>
		`;

		await sendEmail(adminEmail, subject, html);
	}

	return newProduct;
};
const getProductsByCategory = async (category: string) => {
	const products = await Product.find({
		category,
		status: "active", // ✅ Only get active products
	})
		.lean()
		.exec();

	if (!products.length) {
		throw new Error("No products found for this category");
	}

	return products;
};



const getProductByCategorySlug = async (category: string, slug: string) => {
	const collection = Product.collection;
	const productDoc = await collection.findOne({ 
		category, 
		slug: slug
	});

	if (!productDoc) {
		throw new Error("Product not found");
	}

	const product = await Product.findById(productDoc._id).lean().exec();
	return product;
};



const getFilteredProducts = async (category?: string, minPrice?: number, maxPrice?: number) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filter: { [key: string]: any } = {};

	if (category) {
		filter.category = category;
	}

	if (minPrice !== undefined || maxPrice !== undefined) {
		filter.price = {};
		if (minPrice !== undefined) {
			filter.price.$gte = minPrice;
		}
		if (maxPrice !== undefined) {
			filter.price.$lte = maxPrice;
		}
	}

	const products = await Product.find(filter);
	return products;
};


const getAllProductsFromDb = async () => {
	return await Product.aggregate([
		{
			$match: { status: 'active', isDeleted: { $ne: true } }
		},
		{
			$lookup: {
				from: 'reviews',
				localField: '_id',
				foreignField: 'productId',
				as: 'reviews'
			}
		},
		{
			$lookup: {
				from: 'slugs',
				localField: 'slug',
				foreignField: '_id',
				as: 'slug'
			}
		},
		{
			$lookup: {
				from: 'subslugs',
				localField: 'subSlug',
				foreignField: '_id',
				as: 'subSlug'
			}
		},
		{
			$addFields: {
				slug: { $arrayElemAt: ['$slug', 0] },
				subSlug: { $arrayElemAt: ['$subSlug', 0] },
				averageRating: { $avg: '$reviews.rating' },
				totalReviews: { $size: '$reviews' }
			}
		},
		{
			$project: {
				reviews: 0
			}
		}
	]);
};

const getAffiliateProductsFromDb = async () => {
	return await Product.aggregate([
		{
			$match: {
				status: 'active',
				affiliateLink: { $exists: true, $ne: '' } // Only products with a non-empty affiliate link
			}
		},
		{
			$lookup: {
				from: 'reviews',
				localField: '_id',
				foreignField: 'productId',
				as: 'reviews'
			}
		},
		{
			$lookup: {
				from: 'slugs',
				localField: 'slug',
				foreignField: '_id',
				as: 'slug'
			}
		},
		{
			$lookup: {
				from: 'subslugs',
				localField: 'subSlug',
				foreignField: '_id',
				as: 'subSlug'
			}
		},
		{
			$addFields: {
				slug: { $arrayElemAt: ['$slug', 0] },
				subSlug: { $arrayElemAt: ['$subSlug', 0] },
				averageRating: { $avg: '$reviews.rating' },
				totalReviews: { $size: '$reviews' }
			}
		},
		{
			$project: {
				reviews: 0
			}
		}
	]);
};


const getInactiveAndDraftProductsFromDb = async () => {
	return await Product.aggregate([
		{
			$match: {
				status: { $in: ['inactive', 'draft'] } // Match inactive or draft
			}
		},
		{
			$lookup: {
				from: 'reviews',
				localField: '_id',
				foreignField: 'productId',
				as: 'reviews'
			}
		},
		{
			$lookup: {
				from: 'slugs',
				localField: 'slug',
				foreignField: '_id',
				as: 'slug'
			}
		},
		{
			$lookup: {
				from: 'subslugs',
				localField: 'subSlug',
				foreignField: '_id',
				as: 'subSlug'
			}
		},
		{
			$addFields: {
				slug: { $arrayElemAt: ['$slug', 0] },
				subSlug: { $arrayElemAt: ['$subSlug', 0] },
				averageRating: { $avg: '$reviews.rating' },
				totalReviews: { $size: '$reviews' }
			}
		},
		{
			$project: {
				reviews: 0
			}
		}
	]);
};


const getProductBySlug = async (identifier: string) => {
	// Check if identifier is a valid ObjectId
	const isObjectId = Types.ObjectId.isValid(identifier);
	
	let product;
	
	if (isObjectId) {
		// Search by ID
		product = await Product.findOne({
			_id: identifier,
			status: 'active',
			$or: [
				{ isDeleted: false },
				{ isDeleted: { $exists: false } }
			]
		})
			.populate('sellerId', 'name email')
			.populate('relatedProducts', 'name price productImages sku')
			.populate('slug', 'name slug description innerSlugs status')
			.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
			.lean();
	} else {
		// Try urlSlug first (most common case)
		product = await Product.findOne({
			urlSlug: identifier,
			status: 'active',
			isDeleted: { $ne: true }
		})
			.populate('sellerId', 'name email')
			.populate('relatedProducts', 'name price productImages sku')
			.populate('slug', 'name slug description innerSlugs status')
			.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
			.lean();
		
		// If not found, try by name
		if (!product) {
			product = await Product.findOne({
				name: identifier,
				status: 'active',
				isDeleted: { $ne: true }
			})
				.populate('sellerId', 'name email')
				.populate('relatedProducts', 'name price productImages sku')
				.populate('slug', 'name slug description innerSlugs status')
				.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
				.lean();
		}
	}
	
	if (!product) {
		throw new Error('Product not found');
	}
	
	// Increment view count
	await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });
	
	return product;
};

const getProductById = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error("Invalid product ID");
	}

	const product = await Product.findOne({ _id: id, isDeleted: { $ne: true } })
		.populate('sellerId', 'name email')
		.populate('relatedProducts', 'name price productImages sku')
		.populate('slug', 'name slug description innerSlugs status')
		.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
		.lean().exec();

	if (!product) {
		throw new Error("Product not found");
	}

	// Increment view count
	await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

	return product;
};
const getSearchSuggestionsService = async (query: string) => {
	if (!query || typeof query !== "string" || query.trim().length === 0) {
		throw new Error("Query must be a non-empty string");
	}

	// Sanitize and limit query length to prevent DoS
	const sanitizedQuery = DOMPurify.sanitize(query.trim());
	if (sanitizedQuery.length > 100) {
		throw new Error("Query too long");
	}

	// Escape special regex characters to prevent ReDoS attacks
	const escapedQuery = sanitizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(escapedQuery, "i");

	try {
		const matchedProducts = await Product.find({
			$and: [
				{
					$or: [
						{ name: regex },
						{ sku: regex },
						{ tags: { $in: [regex] } }
					]
				},
				{ status: "active" },
				{
					$or: [
						{ isDeleted: false },
						{ isDeleted: { $exists: false } }
					]
				}
			]
		})
			.limit(10)
			.select("name sku slug productImages price discountPrice category")
			.populate('slug', 'name slug description innerSlugs status')
			.lean();

		return matchedProducts;
	} catch (error) {
		throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};
// 	const regex = new RegExp(query, "i"); // Case-insensitive match

// 	const suggestions = await Product.find(
// 		{ name: regex }, // ধরে নিচ্ছি আপনার প্রোডাক্টের নাম `name`
// 		"name" // শুধু নাম return করবো suggestion হিসেবে
// 	)
// 		.limit(10)
// 		.lean();

// 	return suggestions;
// };

const updateProductIntoDb = async (id: string, updateData: Partial<TProduct>) => {
	// Input validation
	if (!Types.ObjectId.isValid(id)) {
		throw new Error("Invalid product ID");
	}

	if (!updateData || typeof updateData !== 'object') {
		throw new Error('Invalid update data');
	}

	// Sanitize string fields
	const sanitizedData = { ...updateData };
	if (sanitizedData.name) {
		sanitizedData.name = DOMPurify.sanitize(sanitizedData.name.toString());
	}
	if (sanitizedData.description) {
		sanitizedData.description = DOMPurify.sanitize(sanitizedData.description.toString());
	}
	if (sanitizedData.longDescription) {
		sanitizedData.longDescription = DOMPurify.sanitize(sanitizedData.longDescription.toString());
	}

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, sanitizedData, { new: true }).lean().exec();
		if (!updatedProduct) {
			throw new Error("Product not found");
		}
		return updatedProduct;
	} catch (error) {
		throw new Error(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};

const deleteProductFromDb = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error("Invalid product ID");
	}

	const product = await Product.findByIdAndDelete(id);

	if (!product) {
		throw new Error("Product not found");
	}
	return product;
};


const getRelatedProducts = async (category: string, excludeId: string) => {
	const relatedProducts = await Product.find({
		category: category,
		_id: { $ne: excludeId }, // Exclude the current product
	}).limit(5); // Limit the number of related products to 5 (or any desired number)

	return relatedProducts;
};

// New service method to update product status
const updateProductStatus = async (
	id: string,
	newStatus: 'active' | 'inactive' | 'draft'
) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error('Invalid product ID');
	}

	const allowedStatuses = ['active', 'inactive', 'draft'];
	if (!allowedStatuses.includes(newStatus)) {
		throw new Error('Invalid status value');
	}

	const updatedProduct = await Product.findByIdAndUpdate(
		id,
		{ status: newStatus },
		{ new: true }
	).lean().exec();

	if (!updatedProduct) {
		throw new Error('Product not found');
	}

	// ✅ Send email based on the new status
	if (updatedProduct.sellerEmail) {
		const sellerName = updatedProduct.sellerName || 'Seller';
		const productName = updatedProduct.name || 'Your product';

		// 🎨 Email content based on status
		let subject = '';
		let messageBody = '';

		switch (newStatus) {
			case 'active':
				subject = `✅ Product Approved: ${productName}`;
				messageBody = `
          <p>Great news! Your product <strong>${productName}</strong> has been approved and is now <strong>active</strong> on the marketplace.</p>
          <p>Customers can now view and purchase your product.</p>
        `;
				break;

			case 'inactive':
				subject = `⚠️ Product Inactivated: ${productName}`;
				messageBody = `
          <p>Your product <strong>${productName}</strong> has been marked as <strong>inactive</strong>.</p>
          <p>This means it’s currently not visible to customers. You can update it anytime from your seller dashboard.</p>
        `;
				break;

			case 'draft':
				subject = `📝 Product Moved to Draft: ${productName}`;
				messageBody = `
          <p>Your product <strong>${productName}</strong> has been moved back to <strong>draft</strong> status.</p>
          <p>Please review the listing and publish it again once ready.</p>
        `;
				break;
		}

		const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
        <h2>Hello ${sellerName},</h2>
        ${messageBody}
        <p>Thank you for using <strong>Mirexa Marketplace</strong>.</p>
        <br/>
        <p style="font-size: 14px; color: #888;">Regards,<br/>Mirexa Marketplace Team</p>
      </div>
    `;

		await sendEmail(updatedProduct.sellerEmail, subject, emailHtml);
	}

	return updatedProduct;
};

// New service methods for enhanced functionality
const updateVariantStock = async (productId: string, variantIndex: number, newStock: number) => {
	if (!Types.ObjectId.isValid(productId)) {
		throw new Error("Invalid product ID");
	}

	const product = await Product.findByIdAndUpdate(
		productId,
		{ [`variants.${variantIndex}.stock`]: newStock },
		{ new: true }
	);

	if (!product) {
		throw new Error("Product not found");
	}

	return product;
};

const getLowStockProducts = async () => {
	return await Product.find({
		$or: [
			{ $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] } },
			{ 'variants.stock': { $lte: 5 } }
		],
		status: 'active',
		trackInventory: true
	}).select('name sku stockQuantity lowStockThreshold variants.stock variants.sku');
};



const incrementWishlistCount = async (productId: string) => {
	if (!Types.ObjectId.isValid(productId)) {
		throw new Error("Invalid product ID");
	}
	
	return await Product.findOneAndUpdate(
		{ _id: productId, isDeleted: { $ne: true } },
		{ $inc: { wishlistCount: 1 } },
		{ new: true }
	);
};

// New service methods for enhanced functionality
const getProductsBySKU = async (sku: string) => {
	return await Product.findOne({ 
		$or: [
			{ sku: sku },
			{ 'variants.sku': sku }
		],
		isDeleted: { $ne: true }
	})
	.populate('slug', 'name slug description innerSlugs status')
	.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
	.lean();
};

const getProductsByBrand = async (brand: string) => {
	return await Product.find({ 
		brand: new RegExp(brand, 'i'), 
		status: 'active',
		isDeleted: { $ne: true }
	})
	.populate('slug', 'name slug description innerSlugs status')
	.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
	.lean();
};

const getFeaturedProducts = async () => {
	return await Product.find({ 
		isFeatured: true, 
		status: 'active',
		isDeleted: { $ne: true }
	})
	.populate('slug', 'name slug description innerSlugs status')
	.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
	.lean();
};

const getNewArrivals = async () => {
	return await Product.find({ 
		isNewArrival: true, 
		status: 'active',
		isDeleted: { $ne: true }
	})
	.sort({ createdAt: -1 })
	.populate('slug', 'name slug description innerSlugs status')
	.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
	.lean();
};

const getProductByUrlSlug = async (urlSlug: string) => {
	const product = await Product.findOne({
		urlSlug: urlSlug,
		status: 'active',
		$or: [
			{ isDeleted: false },
			{ isDeleted: { $exists: false } }
		]
	})
		.populate('sellerId', 'name email')
		.populate('relatedProducts', 'name price productImages sku')
		.populate('slug', 'name slug description innerSlugs status')
		.populate('subSlug', 'name slug description parentSlug innerSubSlugs status')
		.lean();
	
	if (!product) {
		throw new Error('Product not found');
	}
	
	// Increment view count
	await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });
	
	return product;
};

const bulkUpdateProductStatus = async (productIds: string[], newStatus: 'active' | 'inactive' | 'draft') => {
	// Input validation
	if (!Array.isArray(productIds) || productIds.length === 0) {
		throw new Error('Product IDs must be a non-empty array');
	}

	if (productIds.length > 100) {
		throw new Error('Cannot update more than 100 products at once');
	}

	// Validate all product IDs
	for (const id of productIds) {
		if (!Types.ObjectId.isValid(id)) {
			throw new Error(`Invalid product ID: ${id}`);
		}
	}

	const allowedStatuses = ['active', 'inactive', 'draft'];
	if (!allowedStatuses.includes(newStatus)) {
		throw new Error('Invalid status value');
	}

	try {
		const updatedProducts = await Product.updateMany(
			{ _id: { $in: productIds } },
			{ status: newStatus },
			{ new: true }
		);

		if (updatedProducts.matchedCount === 0) {
			throw new Error('No products found');
		}

		return updatedProducts;
	} catch (error) {
		throw new Error(`Bulk update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};

export const ProductService = {
	createProductIntoDb,
	getProductBySlug,
	getProductsByCategory,
	getProductByCategorySlug,
	getFilteredProducts,
	getAllProductsFromDb,
	getAffiliateProductsFromDb,
	getInactiveAndDraftProductsFromDb,
	getProductById,
	getSearchSuggestionsService,
	updateProductIntoDb,
	deleteProductFromDb,
	getRelatedProducts,
	updateProductStatus,
	updateVariantStock,
	getLowStockProducts,
	incrementWishlistCount,
	getProductsBySKU,
	getProductsByBrand,
	getFeaturedProducts,
	getNewArrivals,
	getProductByUrlSlug,
	bulkUpdateProductStatus
};
