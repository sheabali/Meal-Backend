import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { MealController } from './meal.controller';
import { parseBody } from '../../middlewares/bodyParser';
import { multerUpload } from '../../config/multer.config';
import { createMealValidationSchema } from './meal.validation';

const router = Router();

router.post(
  '/menu',
  multerUpload.fields([{ name: 'images' }]),
  parseBody,
  validateRequest(createMealValidationSchema),
  MealController.createMeal
);

export const MealRoutes = router;
