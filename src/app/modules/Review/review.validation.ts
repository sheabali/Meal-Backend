import { z } from 'zod';

export const createReviewValidation = z.object({
  body: z
    .object({
      mealId: z.string().min(24, 'Invalid meal ID'),
      userId: z.string().min(24, 'Invalid user ID'),
      comment: z.string().min(1, 'comment text is required'),
      rating: z
        .number()
        .min(1, 'rating must be between 1 and 5')
        .max(5, 'rating must be between 1 and 5'),
    })
    .strict(),
});
