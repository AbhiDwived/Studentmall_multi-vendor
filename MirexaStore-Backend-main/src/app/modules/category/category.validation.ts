import { z } from 'zod';

const createCategoryValidationSchema = z.object({
	body: z.object({
		name: z.string({
			required_error: 'Category name is required',
		}).min(1, 'Category name cannot be empty').max(100, 'Category name too long'),
		
		slug: z.string().optional(),
		
		image: z.string().url('Invalid image URL').optional(),
		
		bannerImage: z.string().url('Invalid banner image URL').optional(),
		
		description: z.string().max(500, 'Description too long').optional(),
		
		isFeatured: z.boolean().optional(),
		
		status: z.enum(['active', 'inactive']).optional(),
	}),
});

const updateCategoryValidationSchema = z.object({
	body: z.object({
		name: z.string().min(1, 'Category name cannot be empty').max(100, 'Category name too long').optional(),
		
		slug: z.string().optional(),
		
		image: z.string().url('Invalid image URL').optional(),
		
		bannerImage: z.string().url('Invalid banner image URL').optional(),
		
		description: z.string().max(500, 'Description too long').optional(),
		
		isFeatured: z.boolean().optional(),
		
		status: z.enum(['active', 'inactive']).optional(),
	}),
});

export const CategoryValidation = {
	createCategoryValidationSchema,
	updateCategoryValidationSchema,
};