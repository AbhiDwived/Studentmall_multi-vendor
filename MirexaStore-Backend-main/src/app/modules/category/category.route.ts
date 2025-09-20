import express from 'express';
import { CategoryController } from './category.controller';
import authenticate from '../../middlewares/authenticate';
import sellerAdminMiddleware from '../../middlewares/sellerAdminAuthorization';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';

const router = express.Router();

router.post('/', 
	authenticate, 
	sellerAdminMiddleware, 
	validateRequest(CategoryValidation.createCategoryValidationSchema),
	CategoryController.createCategory
);
router.get('/', CategoryController.getAllCategories);
router.get('/my-categories', authenticate, sellerAdminMiddleware, CategoryController.getMyCategoriesAsSeller);
router.get('/id/:id', CategoryController.getCategoryById);
router.get('/:slug', CategoryController.getCategoryBySlug);
router.put('/:id', 
	authenticate, 
	sellerAdminMiddleware, 
	validateRequest(CategoryValidation.updateCategoryValidationSchema),
	CategoryController.updateCategory
);
router.delete('/:id', authenticate, sellerAdminMiddleware, CategoryController.deleteCategory);

export const CategoryRoutes = router;
