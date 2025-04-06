import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { MealController } from './meal.controller';
import { parseBody } from '../../middlewares/bodyParser';
import { multerUpload } from '../../config/multer.config';
import { createMealValidationSchema } from './meal.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../User/user.interface';

const router = Router();

router.post(
  '/menu',
  auth(UserRole.MEAL_PROVIDER),
  multerUpload.fields([{ name: 'images' }]),
  parseBody,
  validateRequest(createMealValidationSchema),
  MealController.createMeal
);

export const MealRoutes = router;
