import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import clientInfoParser from '../../middlewares/clientInfoParser';

const router = express.Router();

router.post(
  '/',
  clientInfoParser,
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.registerUser
);
export const UserRoutes = router;
