import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserRole } from '../User/user.interface';
import auth from '../../middlewares/auth';
import {
  createAddressValidationSchema,
  updatedAddressValidationSchema,
} from './address.validation';
import { AddressController } from './address.controller';

const AddressRoutes = Router();

AddressRoutes.post(
  '/',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  validateRequest(createAddressValidationSchema),
  AddressController.createAddress
);

AddressRoutes.patch(
  '/',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  validateRequest(updatedAddressValidationSchema),
  AddressController.updateAddress
);

AddressRoutes.get(
  '/get-my-address',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  AddressController.getMyAddress
);

export default AddressRoutes;
