import { z } from 'zod';

const createSlugValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    slug: z.string({
      required_error: 'Slug is required',
    }),
    description: z.string().optional(),
    innerSlugs: z.array(z.string()).optional(),
    status: z.boolean().optional(),
  }),
});

const updateSlugValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    innerSlugs: z.array(z.string()).optional(),
    status: z.boolean().optional(),
  }),
});

export const SlugValidation = {
  createSlugValidationSchema,
  updateSlugValidationSchema,
};