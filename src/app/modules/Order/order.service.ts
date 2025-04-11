import mongoose from 'mongoose';
import { IJwtPayload } from '../Auth/auth.interface';
import { IOrder } from './order.interface';
import { Meal } from '../MealProviders/meal.model';
import AppError from '../../errors/AppError';
import User from '../User/user.model';
import { StatusCodes } from 'http-status-codes';
import { Order } from './order.model';
import { generateTransactionId } from '../Payment/payment.utils';

const createOrder = async (
  orderData: Partial<IOrder>,
  authUser: IJwtPayload
) => {
  if (!orderData.paymentMethodId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Payment method is required');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isCustomerExists = await User.findById(orderData.customerId).session(
      session
    );
    if (!isCustomerExists) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Customer not found');
    }

    const orderMeal = await Meal.findById(orderData.meals).session(session);

    if (!orderMeal) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
    }

    if (orderMeal.availability === false) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Meal not available');
    }

    const isMealProviderExists = await User.findById(
      orderMeal.mealProviderId
    ).session(session);

    if (!isMealProviderExists) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Meal provider not found');
    }

    const order = new Order({
      ...orderData,
      user: authUser.userId,
    });

    const createdOrder = await order.save({ session });
    await createdOrder.populate('user products.product');

    const transactionId = generateTransactionId();
  } catch (error: any) {
    console.log(error);
  }
};

export const OrderService = {
  createOrder,
};
