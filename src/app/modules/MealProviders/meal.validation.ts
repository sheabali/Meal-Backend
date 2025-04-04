import { z } from 'zod';

export const createMealValidation = z
  .object({
    name: z.string({ required_error: 'Meal name is required' }).nonempty(),
    description: z
      .string({ required_error: 'Meal description is required' })
      .nonempty(),
    ingredients: z
      .array(z.string({ required_error: 'Ingredients are required' }))
      .nonempty(),
    portionSize: z
      .string({ required_error: 'Portion size is required' })
      .nonempty(),
    price: z.number({ required_error: 'Price is required' }).positive(),
    availability: z.boolean(),
  })
  .strict();

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
