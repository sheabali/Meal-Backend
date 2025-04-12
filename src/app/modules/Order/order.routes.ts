import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../User/user.interface';
import { OrderController } from './order.controller';
import {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
} from './order.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  validateRequest(createOrderValidationSchema),
  OrderController.createOrder
);

router.get(
  '/get-orders',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  OrderController.getOrders
);
router.patch(
  '/change-status/:id',
  auth(UserRole.MEAL_PROVIDER),
  validateRequest(updateOrderStatusValidationSchema),
  OrderController.updateOrderStatus
);

export const OrderRoutes = router;
