import { z } from 'zod';

export const createOrderValidationSchema = z.object({
  body: z
    .object({
      paymentMethodId: z.string({
        required_error: 'PaymentMethodId is required',
      }),
      customerId: z.string().min(1, 'Customer ID is required'),
      meals: z.string().min(1, 'Meal ID is required'),
      customization: z.string().optional(), // Customization is optional
      schedule: z
        .string()
        .min(1, 'Schedule is required')
        .refine((val) => !isNaN(Date.parse(val)), {
          message:
            'Invalid schedule format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).',
        }),
      deliveryAddress: z.string().min(1, 'Delivery address is required'),
    })
    .strict(),
});

export const updateOrderStatusValidationSchema = z.object({
  body: z
    .object({
      status: z.enum(['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED']),
    })
    .strict(),
});
