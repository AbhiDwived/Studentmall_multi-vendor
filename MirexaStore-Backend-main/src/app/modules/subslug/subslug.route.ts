import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SubSlugValidation } from './subslug.validation';
import { SubSlugControllers } from './subslug.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('seller', 'admin'),
  SubSlugControllers.createSubSlug,
);

router.get('/', SubSlugControllers.getAllSubSlugs);

router.get('/parent/:slugId', SubSlugControllers.getSubSlugsByParent);

router.patch(
  '/:id/inner-subslug',
  auth('seller', 'admin'),
  SubSlugControllers.addInnerSubSlug,
);

router.patch(
  '/:id',
  auth('seller', 'admin'),
  SubSlugControllers.updateSubSlug,
);

router.delete('/:id', auth('seller', 'admin'), SubSlugControllers.deleteSubSlug);

export const SubSlugRoutes = router;