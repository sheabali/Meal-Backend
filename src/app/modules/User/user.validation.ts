import { z } from 'zod';
import { UserRole } from './user.interface';

const clientInfoSchema = z.object({
  device: z.enum(['pc', 'mobile']).optional().default('pc'), // Allow only 'pc' or 'mobile'
  browser: z.string().min(1, 'Browser name is required'),
  ipAddress: z.string().min(1, 'IP address is required'),
  pcName: z.string().optional(), // Optional field
  os: z.string().optional(), // Optional field
  userAgent: z.string().min(1, 'User agent is required'),
});

const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z
      .enum([UserRole.CUSTOMER, UserRole.MEAL_PROVIDER])
      .default(UserRole.CUSTOMER), // Match role values
    clientInfo: clientInfoSchema, // Ensure this schema includes relevant client details
  }),
});

export const UserValidation = {
  userValidationSchema,
};
