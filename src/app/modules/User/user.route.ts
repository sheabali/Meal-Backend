import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  updateCustomerProfileValidationSchema,
  updateProviderProfileValidationSchema,
  UserValidation,
} from './user.validation';
import { UserControllers } from './user.controller';
import clientInfoParser from '../../middlewares/clientInfoParser';
import { UserRole } from './user.interface';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  clientInfoParser,
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.registerUser
);
router.patch(
  '/update-customer-profile',
  auth(UserRole.CUSTOMER),
  validateRequest(updateCustomerProfileValidationSchema.body),
  UserControllers.updateCustomerProfile
);
router.patch(
  '/update-provider-profile',
  auth(UserRole.MEAL_PROVIDER),
  validateRequest(updateProviderProfileValidationSchema.body),
  UserControllers.updateProviderProfile
);
router.get(
  '/:id',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  UserControllers.getSingleUser
);
export const UserRoutes = router;
