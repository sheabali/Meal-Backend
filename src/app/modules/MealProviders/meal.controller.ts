import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IImageFiles } from '../../interface/IImageFile';
import { MealService } from './meal.service';

const createMeal = catchAsync(async (req, res) => {
  const result = await MealService.createMeal(
    req.body,
    req.files as IImageFiles
    // req.user as IJwtPayload
  );
  console.log('result', req.files);
  // sendResponse(res, {
  //   statusCode: StatusCodes.CREATED,
  //   success: true,
  //   message: 'Meal created successfully',
  // data: mealData,
  // });
});

export const MealController = { createMeal };
