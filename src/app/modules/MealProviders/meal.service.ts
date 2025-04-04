import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IMeal } from './meal.interface';
import { IImageFiles } from '../../interface/IImageFile';

const createMeal = async (
  productData: Partial<IMeal>,
  productImages: IImageFiles
  // authUser: IJwtPayload
) => {
  // const shop = await hasActiveShop(authUser.userId);
  // const { images } = productImages;
  // if (!images || images.length === 0) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, 'Product images are required.');
  // }
  // productData.imageUrls = images.map((image) => image.path);
  // const isCategoryExists = await Category.findById(productData.category);
  // if (!isCategoryExists) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, 'Category does not exist!');
  // }
  // if (!isCategoryExists.isActive) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, 'Category is not active!');
  // }
  // const newProduct = new Product({
  //   ...productData,
  //   shop: shop._id,
  // });
  // const result = await newProduct.save();
  // return result;
};

export const MealService = {
  createMeal,
  //   getAllProduct,
  //   getTrendingProducts,
  //   getSingleProduct,
  //   updateProduct,
  //   deleteProduct,
  //   getMyShopProducts
};
