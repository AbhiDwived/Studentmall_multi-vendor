import express from 'express';
import authenticate from '../../middlewares/authenticate';
import { ProductController } from './product.controller';
import sellerAdminMiddleware from '../../middlewares/sellerAdminAuthorization';
import adminMiddleware from '../../middlewares/adminAuthorization';

const router = express.Router();

router.post('/', authenticate, sellerAdminMiddleware, ProductController.createProduct);
router.get('/filter', ProductController.getFilteredProducts);
router.get('/', ProductController.getAllProducts);
router.get('/affiliate-products', authenticate, sellerAdminMiddleware, ProductController.getAffiliateProducts);
router.get('/inactive-draft', authenticate, sellerAdminMiddleware, ProductController.getInactiveAndDraftProducts);
router.get('/history/:id', ProductController.getProductById);
router.get('/details/:id', ProductController.getProductById);
router.get("/search-suggestions", ProductController.getSearchSuggestions);
router.get('/low-stock/alert', authenticate, sellerAdminMiddleware, ProductController.getLowStockProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/new-arrivals', ProductController.getNewArrivals);
router.get('/sku/:sku', ProductController.getProductBySKU);
router.get('/brand/:brand', ProductController.getProductsByBrand);
router.get('/url-slug/:urlSlug', ProductController.getProductsByUrlSlug);
router.get('/category/:category', ProductController.getProductsByCategory);
router.get('/category/:category/:slug', ProductController.getProductByCategorySlug);
router.get('/:slug', ProductController.getProductBySlug);

router.put('/:id', authenticate, ProductController.updateProduct);
router.patch('/status/:id', authenticate, adminMiddleware, ProductController.updateProductStatus);
router.patch('/bulk-status', authenticate, adminMiddleware, ProductController.bulkUpdateProductStatus);
router.patch('/variant-stock/:productId/:variantIndex', authenticate, sellerAdminMiddleware, ProductController.updateVariantStock);
router.patch('/wishlist/:id', ProductController.incrementWishlistCount);
router.delete('/:id', authenticate, ProductController.deleteProduct);
router.get('/:id/related', ProductController.getRelatedProducts);

export const ProductRoutes = router;
