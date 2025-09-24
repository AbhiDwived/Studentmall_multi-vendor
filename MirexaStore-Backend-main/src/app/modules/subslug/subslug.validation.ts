import { z } from 'zod';

const createSubSlugValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    slug: z.string({
      required_error: 'Slug is required',
    }),
    description: z.string().optional(),
    parentSlug: z.string({
      required_error: 'Parent Slug is required',
    }),
    innerSubSlugs: z.array(z.string()).optional(),
    status: z.boolean().optional(),
  }),
});

const updateSubSlugValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    parentSlug: z.string().optional(),
    innerSubSlugs: z.array(z.string()).optional(),
    status: z.boolean().optional(),
  }),
});

export const SubSlugValidation = {
  createSubSlugValidationSchema,
  updateSubSlugValidationSchema,
};