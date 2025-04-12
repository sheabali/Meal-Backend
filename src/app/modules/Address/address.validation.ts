import { z } from 'zod';

export const createAddressValidationSchema = z
  .object({
    zipCode: z.string({ required_error: 'Zip code is required' }).nonempty(),
    pickupStreet: z.string({ required_error: 'Street is required' }).nonempty(),
    houseNo: z.string({ required_error: 'House no. is required' }).nonempty(),
    city: z.string({ required_error: 'City is required' }).nonempty(),
  })
  .strict();

export const updatedAddressValidationSchema = z.object({
  zipCode: z.string().optional(),
  pickupStreet: z.string().optional(),
  houseNo: z.string().optional(),
  city: z.string().optional(),
});
