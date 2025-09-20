import { z } from 'zod';

const createBrandValidationSchema = z.object({
	body: z.object({
		name: z.string({
			required_error: 'Brand name is required',
		}).min(1, 'Brand name cannot be empty').max(100, 'Brand name too long'),
		
		slug: z.string().optional(),
		
		logo: z.string().url('Invalid logo URL').optional(),
		
		description: z.string().max(500, 'Description too long').optional(),
		
		status: z.enum(['active', 'inactive']).optional(),
	}),
});

const updateBrandValidationSchema = z.object({
	body: z.object({
		name: z.string().min(1, 'Brand name cannot be empty').max(100, 'Brand name too long').optional(),
		
		slug: z.string().optional(),
		
		logo: z.string().url('Invalid logo URL').optional(),
		
		description: z.string().max(500, 'Description too long').optional(),
		
		status: z.enum(['active', 'inactive']).optional(),
	}),
});

export const BrandValidation = {
	createBrandValidationSchema,
	updateBrandValidationSchema,
};