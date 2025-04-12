import { Router } from 'express';
import { UserRole } from '../User/user.interface';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

const routes = Router();

// Add your routes here
routes.post(
  '/',
  auth(UserRole.CUSTOMER, UserRole.MEAL_PROVIDER),
  validateRequest(createReviewValidation),
  ReviewController.createReview
);

export const ReviewRoutes = routes;
