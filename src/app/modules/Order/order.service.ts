import mongoose from 'mongoose';
import Stripe from 'stripe';
import { IJwtPayload } from '../Auth/auth.interface';
import { IOrder } from './order.interface';
import { Meal } from '../MealProviders/meal.model';
import AppError from '../../errors/AppError';
import User from '../User/user.model';
import { StatusCodes } from 'http-status-codes';
import { Order } from './order.model';
import config from '../../config';
import { IUser, UserRole } from '../User/user.interface';

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2025-03-31.basil',
});

const createOrder = async (orderData: IOrder, authUser: IJwtPayload) => {
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

    console.log('orderMeal', orderMeal.mealProviderId); // geting orderMeal successfully
    const isMealProviderExists = await User.findById(
      orderMeal.mealProviderId
    ).session(session);

    console.log('isMealProviderExists', isMealProviderExists); // geting mealProviderId successfully

    if (!isMealProviderExists) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Meal provider not found');
    }
    const { paymentMethodId, ...modifiedPayload } = orderData;
    const order = await Order.create(
      [
        {
          ...modifiedPayload,
          mealProviderId: orderMeal.mealProviderId,
          amount: orderMeal.price,
        },
      ],
      {
        session,
      }
    );

    if (!order.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Order not created');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderMeal.price * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    if (!paymentIntent.id) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Payment not created');
    }

    if (paymentIntent.status === 'succeeded') {
      order[0].paymentStatus = 'PAID';
      order[0].paymentIntentId = paymentIntent.id;
      await order[0].save({ session });
      await session.commitTransaction();
      return {
        success: true,
        message: 'Order created and payment successful',
        order: { orderId: order[0]._id },
      };
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Payment failed');
    }
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getOrders = async (user: IUser, query: Record<string, unknown>) => {
  console.log('user', user); // geting user successfully

  const customer = await User.findOne({
    _id: user.userId,
  });

  console.log('customer', customer); // geting customer successfully

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Customer not found');
  }

  const { role } = customer;
  let orders;
  if (role === UserRole.CUSTOMER) {
    orders = await Order.find({ customerId: user._id })
      .populate('meals')
      .populate('mealProviderId');
  } else if (role === UserRole.MEAL_PROVIDER) {
    orders = await Order.find({ mealProviderId: user._id })
      .populate('meals')
      .populate('customerId');
  } else {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied');
  }
  if (!orders) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No orders found');
  }
  return orders;
};

const updateOrderStatus = async (
  status: 'PENDING' | 'ACCEPTED' | 'DELIVERED' | 'CANCELLED',
  id: string
) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  console.log('params', id); // geting params successfully
  console.log('status', status); // geting status successfully
  const result = await Order.findByIdAndUpdate(
    id,
    { status: status },
    { new: true }
  );
  return result;
};

// Exporting the OrderService object containing the methods
export const OrderService = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
