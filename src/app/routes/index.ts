import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { MealRoutes } from '../modules/MealProviders/meal.routes';
import { OrderRoutes } from '../modules/Order/order.routes';
import AddressRoutes from '../modules/Address/address.routes';

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
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/address',
    route: AddressRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
