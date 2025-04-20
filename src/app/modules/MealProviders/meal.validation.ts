import { z } from 'zod';

export const createMealValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Meal name is required' })
      .min(1, 'Meal name cannot be empty'),

    description: z
      .string({ required_error: 'Meal description is required' })
      .min(1, 'Meal description cannot be empty'),

    ingredients: z
      .array(z.string({ required_error: 'Ingredients are required' }))
      .min(1, 'At least one ingredient is required'),

    portionSize: z
      .string({ required_error: 'Portion size is required' })
      .min(1, 'Portion size cannot be empty'),

    price: z
      .number({ required_error: 'Price is required' })
      .positive('Price must be greater than 0'),

    availability: z.boolean().optional(),

    ratings: z.number().min(0).max(5).optional().default(0),
    totalRatings: z.number().min(0).optional().default(0),
    isDeleted: z.boolean().optional().default(false),
  }),
});

export const updateMealValidation = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    ingredients: z.array(z.string()).optional(),
    portionSize: z.string().optional(),
    price: z.number().positive().optional(),
    availability: z.boolean().optional(),
  })
  .strict();
