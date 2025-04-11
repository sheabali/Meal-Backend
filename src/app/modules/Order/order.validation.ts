import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const orderSchema = z.object({
  customerId: objectIdSchema,
  mealId: objectIdSchema,
  mealProviderId: objectIdSchema,
  amount: z.number().positive(),
  customization: z.string(),
  schedule: z.coerce.date(),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  status: z.enum(['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED']),
  paymentStatus: z.enum(['PENDING', 'PAID']),
  isDeleted: z.boolean(),
  paymentIntentId: z.string().optional(),
});

export const updateOrderStatusValidationSchema = z
  .object({
    status: z.enum(['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED']),
  })
  .strict();
