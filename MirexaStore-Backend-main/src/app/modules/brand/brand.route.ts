import express from 'express';
import { BrandController } from './brand.controller';
import authenticate from '../../middlewares/authenticate';
import sellerAdminMiddleware from '../../middlewares/sellerAdminAuthorization';
import validateRequest from '../../middlewares/validateRequest';
import { BrandValidation } from './brand.validation';

const router = express.Router();

router.post('/', 
	authenticate, 
	sellerAdminMiddleware, 
	validateRequest(BrandValidation.createBrandValidationSchema),
	BrandController.createBrand
);
router.get('/', BrandController.getAllBrands);
router.get('/my-brands', authenticate, sellerAdminMiddleware, BrandController.getMyBrandsAsSeller);
router.get('/id/:id', BrandController.getBrandById);
router.get('/:slug', BrandController.getBrandBySlug);
router.put('/:id', 
	authenticate, 
	sellerAdminMiddleware, 
	validateRequest(BrandValidation.updateBrandValidationSchema),
	BrandController.updateBrand
);
router.delete('/:id', authenticate, sellerAdminMiddleware, BrandController.deleteBrand);

export const BrandRoutes = router;