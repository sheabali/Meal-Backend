import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { MealController } from './meal.controller';
import { parseBody } from '../../middlewares/bodyParser';
import { multerUpload } from '../../config/multer.config';
import { createMealValidationSchema } from './meal.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../User/user.interface';

const router = Router();

router.get('/my-menus', MealController.getMyMenus);
router.get('/my-menu', auth(UserRole.MEAL_PROVIDER), MealController.getMyMenu);

router.get(
  '/:menuId',
  auth(UserRole.MEAL_PROVIDER, UserRole.CUSTOMER),
  MealController.getSingleMeal
);

router.post(
  '/menu',

  auth(UserRole.MEAL_PROVIDER),
  multerUpload.fields([{ name: 'images' }]),
  parseBody,
  validateRequest(createMealValidationSchema),
  MealController.createMeal
);

router.patch(
  '/:menuId',
  auth(UserRole.MEAL_PROVIDER),
  multerUpload.fields([{ name: 'images' }]),
  parseBody,
  MealController.updateMeal
);

router.delete('/:id', auth(UserRole.MEAL_PROVIDER), MealController.deleteMeal);

export const MealRoutes = router;
