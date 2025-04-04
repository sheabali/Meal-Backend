import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { MealRoutes } from '../modules/MealProviders/meal.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/providers',
    route: MealRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
