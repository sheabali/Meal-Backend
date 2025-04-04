import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createMealValidation } from './meal.validation';
import { MealController } from './meal.controller';

const router = Router();

router.post(
  '/menu',
  validateRequest(createMealValidation),
  MealController.createMeal
);

export const MealRoutes = router;
