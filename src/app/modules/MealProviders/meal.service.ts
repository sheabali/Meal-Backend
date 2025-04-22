import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IMeal } from './meal.interface';
import { IImageFiles } from '../../interface/IImageFile';
import { Meal } from './meal.model';
import { IJwtPayload } from '../Auth/auth.interface';
import User from '../User/user.model';
import { IUser, UserRole } from '../User/user.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const getMyMenus = async (query: Record<string, unknown>) => {
  const mealsQuery = new QueryBuilder(
    Meal.find({ isDeleted: false, ...query }),
    query
  )
    .search(['name', 'description', 'ingredients'])
    .filter()
    .sort()
    .paginate();

  const meals = await mealsQuery.modelQuery.exec();
  const meta = await mealsQuery.getMetaData();

  return {
    meta: { ...meta },
    meals: meals,
  };
};
const getMyMenu = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const user = await User.findOne({
    _id: authUser.userId,
    role: UserRole.MEAL_PROVIDER,
  });
  console.log('user', user);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
  }
  // const mealsQuery = new QueryBuilder(Meal.find({ isDeleted: false }), query)
  //   .search(['name', 'description', 'ingredients'])
  //   .filter()
  //   .sort()
  //   .paginate();

  const mealsQuery = new QueryBuilder(
    Meal.find({ mealProviderId: user._id, isDeleted: false, ...query }),
    query
  )
    .search(['name', 'description', 'ingredients'])
    .filter()
    .sort()
    .paginate();

  const meals = await mealsQuery.modelQuery.exec();
  const meta = await mealsQuery.getMetaData();

  return {
    meta: { ...meta },
    meals: meals,
  };
};
const getSingleMeal = async (
  menuId: string,
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const user = await User.findOne({
    _id: authUser.userId,
    role: UserRole.MEAL_PROVIDER,
  });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
  }
  const meal = await Meal.findById(menuId);
  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
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

  const result = await newProduct.save();
  return result;
};
const updateMeal = async (
  productId: string,
  payload: Partial<IMeal>,
  mealImages: IImageFiles,
  user: IJwtPayload
) => {
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

const deleteMeal = async (user: Partial<IUser>, id: string) => {
  console.log('user', user);
  const provider = await User.findOne({
    _id: user?.userId,
    role: UserRole.MEAL_PROVIDER,
  });

  console.log('id....', id);

  if (!provider) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
  }
  const doesProviderOwnTheMeal = await Meal.findOne({
    _id: id,
    mealProviderId: user?.userId,
  });

  console.log('doesProviderOwnTheMeal', doesProviderOwnTheMeal);

  if (!doesProviderOwnTheMeal) {
    throw new AppError(StatusCodes.FORBIDDEN, "You don't own this meal");
  }
  // Find the existing meal first
  const existingMeal = await Meal.findById(id);

  if (!existingMeal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
  }
  const result = await Meal.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const MealService = {
  createMeal,
  getMyMenu,
  updateMeal,
  getSingleMeal,
  deleteMeal,
  getMyMenus,
};
