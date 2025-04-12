import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IReview } from './review.interface';
import { Review } from './review.model';
import User from '../User/user.model';
import { Meal } from '../MealProviders/meal.model';
import { startSession } from 'mongoose';

const createReview = async (payload: IReview) => {
  const isAlreadyReviewed = await Review.findOne({
    userId: payload?.userId,
    mealId: payload?.mealId,
  });
  if (isAlreadyReviewed) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'You have already reviewed this meal'
    );
  }
  const isUserExist = await User.findById(payload?.userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const meal = await Meal.findById(payload?.mealId);
  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  const session = await startSession();
  try {
    await session.startTransaction();
    const review = await Review.create([payload], { session });

    // Calculate new average rating
    const newTotalRatings = (meal.totalRatings ?? 0) + 1;
    const newAvgRating =
      ((meal.ratings ?? 0) * (meal.totalRatings ?? 0) + payload.rating) /
      newTotalRatings;

    // Update the meal object directly (safer than findByIdAndUpdate)
    meal.totalRatings = newTotalRatings;
    meal.ratings = newAvgRating;

    // Save the meal with session
    await meal.save({ session });

    await session.commitTransaction();
    return review[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const ReviewService = {
  createReview,
};
