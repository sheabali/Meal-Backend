import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IMeal } from './meal.interface';
import { IImageFiles } from '../../interface/IImageFile';
import { Meal } from './meal.model';
import { IJwtPayload } from '../Auth/auth.interface';
import User from '../User/user.model';
import { UserRole } from '../User/user.interface';

const getMyMenu = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const result = await Meal.find({ mealProviderId: authUser.userId }).populate(
    'mealProviderId'
  );

  return result;
};
const getSingleMeal = async (
  menuId: string,
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const result = await Meal.findById(menuId);
  return result;
};

const createMeal = async (
  mealData: Partial<IMeal>,
  mealImages: IImageFiles,
  user: IJwtPayload
) => {
  // console.log('user', user);

  const provider = await User.findOne({
    _id: user.userId,
    role: UserRole.MEAL_PROVIDER,
  });
  console.log('provider', provider);
  if (!provider) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
  }
  const { images } = mealImages;

  if (!images || images.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Meal images are required.');
  }

  mealData.image = images.map((image) => image.path);

  const newProduct = new Meal({
    ...mealData,
    mealProviderId: provider?.id,
  });

  console.log('newProduct', newProduct);

  const result = await newProduct.save();
  return result;
};
const updateMeal = async (
  productId: string,
  payload: Partial<IMeal>,
  mealImages: IImageFiles,
  user: IJwtPayload
) => {
  console.log('productId', productId);
  const meal = await Meal.findById(productId);
  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  console.log('meal', meal);

  const provider = await User.findOne({
    _id: user.userId,
    role: UserRole.MEAL_PROVIDER,
  });

  if (!provider) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
  }
  const { images } = mealImages;

  if (!images || images.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Meal images are required.');
  }

  payload.image = images.map((image) => image.path);

  return await Meal.findByIdAndUpdate(productId, payload, { new: true });
};
export const MealService = {
  createMeal,
  getMyMenu,
  updateMeal,
  getSingleMeal,
};
