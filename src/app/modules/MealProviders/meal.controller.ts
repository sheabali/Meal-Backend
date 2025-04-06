import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IImageFiles } from '../../interface/IImageFile';
import { MealService } from './meal.service';
import { IJwtPayload } from '../Auth/auth.interface';

const createMeal = catchAsync(async (req, res) => {
  console.log('result', req.user);
  const result = await MealService.createMeal(
    req.body,
    req.files as IImageFiles,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Meal created successfully',
    data: result,
  });
});

export const MealController = { createMeal };
