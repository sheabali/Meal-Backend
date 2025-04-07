import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IImageFiles } from '../../interface/IImageFile';
import { MealService } from './meal.service';
import { IJwtPayload } from '../Auth/auth.interface';
import { Meal } from './meal.model';
import { JwtPayload } from 'jsonwebtoken';

const getSingleMeal = catchAsync(async (req, res) => {
  const { menuId } = req.params;
  const { query } = req;
  const result = await MealService.getSingleMeal(
    menuId,
    query,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Menu are retrieved successfully',
    data: result,
  });
});
const getMyMenu = catchAsync(async (req, res) => {
  const result = await MealService.getMyMenu(
    req.query,
    req.user as IJwtPayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Menu are retrieved successfully',
    data: result,
  });
});

const createMeal = catchAsync(async (req, res) => {
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
const updateMeal = catchAsync(async (req, res) => {
  const {
    user,
    body: payload,
    params: { menuId },
  } = req;

  const result = await MealService.updateMeal(
    menuId,
    payload,
    req.files as IImageFiles,
    user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meal update successfully',
    data: result,
  });
});

export const MealController = {
  createMeal,
  getMyMenu,
  updateMeal,
  getSingleMeal,
};
