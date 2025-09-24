import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SlugValidation } from './slug.validation';
import { SlugControllers } from './slug.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('seller', 'admin'),
  SlugControllers.createSlug,
);

router.get('/', SlugControllers.getAllSlugs);

router.patch(
  '/:id/inner-slug',
  auth('seller', 'admin'),
  SlugControllers.addInnerSlug,
);

router.patch(
  '/:id',
  auth('seller', 'admin'),
  SlugControllers.updateSlug,
);

router.delete('/:id', auth('seller', 'admin'), SlugControllers.deleteSlug);

export const SlugRoutes = router;