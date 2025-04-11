import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../User/user.interface';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createOrderValidationSchema } from './order.validation';

const router = Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  // validateRequest(createOrderValidationSchema),
  OrderController.createOrder
);

export const OrderRoutes = router;
