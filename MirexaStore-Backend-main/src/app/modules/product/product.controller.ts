// controllers/product.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
	const newProduct = await ProductService.createProductIntoDb(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product added successfully',
		data: newProduct,
	});
});

const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
	const { category } = req.params;

	const products = await ProductService.getProductsByCategory(category);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Products retrieved successfully for this category',
		data: products,
	});
});


const getProductByCategorySlug = catchAsync(async (req: Request, res: Response) => {
	const { category, slug } = req.params;

	const product = await ProductService.getProductByCategorySlug(category, slug);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product retrieved successfully',
		data: product,
	});
});


const getFilteredProducts = catchAsync(async (req: Request, res: Response) => {
	const { category, minPrice, maxPrice } = req.query;

	// Convert minPrice and maxPrice to numbers (if they are present)
	const minPriceNumber = minPrice ? parseFloat(minPrice as string) : undefined;
	const maxPriceNumber = maxPrice ? parseFloat(maxPrice as string) : undefined;

	const filteredProducts = await ProductService.getFilteredProducts(
		category as string,
		minPriceNumber,
		maxPriceNumber
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Filtered products retrieved successfully',
		data: filteredProducts,
	});
});


const getAllProducts = catchAsync(async (req: Request, res: Response) => {
	const products = await ProductService.getAllProductsFromDb();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Products retrieved successfully',
		data: products,
	});
});

const getAffiliateProducts = catchAsync(async (req: Request, res: Response) => {
	const products = await ProductService.getAffiliateProductsFromDb();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Affiliate products retrieved successfully',
		data: products,
	});
});


const getInactiveAndDraftProducts = catchAsync(
	async (req: Request, res: Response) => {
		const products = await ProductService.getInactiveAndDraftProductsFromDb();

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Inactive and Draft products retrieved successfully',
			data: products,
		});
	}
);
// Get Product by Slug
const getProductBySlug = async (req: Request, res: Response) => {
	try {
		const { slug } = req.params;
		console.log('Looking for product with slug:', slug);
		const product = await ProductService.getProductBySlug(slug);
		console.log('Found product:', product ? product.name : 'Not found');
		res.status(200).json({ 
			success: true,
			message: 'Product retrieved successfully',
			data: product 
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.log('Error finding product:', error.message);
		res.status(404).json({ 
			success: false,
			message: error.message 
		});
	}
};

const getProductById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const product = await ProductService.getProductById(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product retrieved successfully',
		data: product,
	});
});
const getSearchSuggestions = async (req: Request, res: Response) => {
	try {
		const { query } = req.query;

		if (!query || typeof query !== 'string' || query.trim().length === 0) {
			return res.status(400).json({ message: 'Query is required' });
		}

		const suggestions = await ProductService.getSearchSuggestionsService(query);
		return res.status(200).json(suggestions); // must be array of strings
	} catch (error) {

		return res.status(500).json({ message: 'Failed to fetch suggestions' });
	}
};

const updateProduct = catchAsync(async (req: Request, res: Response) => {
	const productId = req.params.id;
	const updatedProductData = req.body;
	const updatedProduct = await ProductService.updateProductIntoDb(productId, updatedProductData);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product updated successfully',
		data: updatedProduct,
	});
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const product = await ProductService.deleteProductFromDb(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product deleted successfully',
		data: product,
	});
});

const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params; // Get the product ID from request parameters
	const product = await ProductService.getProductById(id); // Fetch the product to get its category
	const relatedProducts = await ProductService.getRelatedProducts(product.category, id); // Get related products

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Related products retrieved successfully',
		data: relatedProducts,
	});
});

const updateProductStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;

	const validStatuses = ['active', 'inactive', 'draft'];
	if (!validStatuses.includes(status)) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: 'Invalid status value. Must be one of: active, inactive, draft.',
		});
	}

	const updatedProduct = await ProductService.updateProductStatus(id, status);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `Product status updated to ${status}`,
		data: updatedProduct,
	});
});


// New controller methods for enhanced functionality
const updateVariantStock = catchAsync(async (req: Request, res: Response) => {
	const { productId, variantIndex } = req.params;
	const { stock } = req.body;

	if (typeof stock !== 'number' || stock < 0) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: 'Stock must be a non-negative number',
		});
	}

	const updatedProduct = await ProductService.updateVariantStock(
		productId,
		parseInt(variantIndex),
		stock
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Variant stock updated successfully',
		data: updatedProduct,
	});
});

const getLowStockProducts = catchAsync(async (req: Request, res: Response) => {
	const products = await ProductService.getLowStockProducts();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Low stock products retrieved successfully',
		data: products,
	});
});



const incrementWishlistCount = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const updatedProduct = await ProductService.incrementWishlistCount(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Wishlist count incremented successfully',
		data: updatedProduct,
	});
});

// New controller methods for enhanced functionality
const getProductBySKU = catchAsync(async (req: Request, res: Response) => {
	const { sku } = req.params;

	const product = await ProductService.getProductsBySKU(sku);

	if (!product) {
		return res.status(httpStatus.NOT_FOUND).json({
			success: false,
			message: 'Product not found with this SKU',
		});
	}

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product retrieved by SKU successfully',
		data: product,
	});
});

const getProductsByBrand = catchAsync(async (req: Request, res: Response) => {
	const { brand } = req.params;

	const products = await ProductService.getProductsByBrand(brand);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Products retrieved by brand successfully',
		data: products,
	});
});

const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
	const products = await ProductService.getFeaturedProducts();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Featured products retrieved successfully',
		data: products,
	});
});

const getNewArrivals = catchAsync(async (req: Request, res: Response) => {
	const products = await ProductService.getNewArrivals();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'New arrival products retrieved successfully',
		data: products,
	});
});

const getProductsByUrlSlug = catchAsync(async (req: Request, res: Response) => {
	const { urlSlug } = req.params;

	if (!urlSlug || typeof urlSlug !== 'string' || urlSlug.trim().length === 0) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: 'URL slug is required and must be a valid string',
		});
	}

	const product = await ProductService.getProductByUrlSlug(urlSlug.trim());

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product retrieved by URL slug successfully',
		data: product,
	});
});

const bulkUpdateProductStatus = catchAsync(async (req: Request, res: Response) => {
	const { productIds, status } = req.body;

	const validStatuses = ['active', 'inactive', 'draft'];
	if (!validStatuses.includes(status)) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: 'Invalid status value. Must be one of: active, inactive, draft.',
		});
	}

	const updatedProducts = await ProductService.bulkUpdateProductStatus(productIds, status);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `Products status updated to ${status}`,
		data: updatedProducts,
	});
});

export const ProductController = {
	createProduct,
	getProductBySlug,
	getProductsByCategory,
	getProductByCategorySlug,
	getFilteredProducts,
	getAllProducts,
	getAffiliateProducts,
	getInactiveAndDraftProducts,
	getProductById,
	updateProduct,
	getSearchSuggestions,
	deleteProduct,
	getRelatedProducts,
	updateProductStatus,
	updateVariantStock,
	getLowStockProducts,
	incrementWishlistCount,
	getProductBySKU,
	getProductsByBrand,
	getFeaturedProducts,
	getNewArrivals,
	getProductsByUrlSlug,
	bulkUpdateProductStatus
};
