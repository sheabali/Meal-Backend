import { Router } from 'express';
import clientInfoParser from '../../middlewares/clientInfoParser';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../User/user.interface';

const router = Router();

router.post('/login', clientInfoParser, AuthController.loginUser);

router.post(
  '/change-password',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
