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
import { startSession } from 'mongoose';

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2025-03-31.basil',
});
console.log('stripe', stripe); // geting stripe successfully

const createOrder = async (payload: IOrder) => {
  if (!payload?.paymentMethodId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Payment method is required');
  }
  const session = await startSession();
  try {
    session.startTransaction();
    // checking if the customer who ordered is exist
    const isCustomerExists = await User.findById(payload.customerId).session(
      session
    );
    if (!isCustomerExists) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'The customer is not found');
    }

    // Step 1: Find the meal (inside transaction)
    const productToOrder = await Meal.findById(payload?.meals).session(session);
    if (!productToOrder) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'The Meal you want to order is not found'
      );
    }
    if (!productToOrder.availability) {
      throw new AppError(StatusCodes.FORBIDDEN, 'The meal is not available');
    }
    const mealProvider = await User.findById(
      productToOrder.mealProviderId
    ).session(session);

    if (!mealProvider) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Meal provider not found'
      );
    }
    // Step 2: Create order (without payment info yet)
    const { paymentMethodId, ...modifiedPayload } = payload;
    const order = await Order.create(
      [
        {
          ...modifiedPayload,
          mealProviderId: productToOrder.mealProviderId,
          amount: productToOrder.price,
        },
      ],
      {
        session,
      }
    );
    if (!order.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create order');
    }
    // Step 3: Process payment by creating a paymentIntent using the provided paymentMethodId
    const paymentIntent = await stripe.paymentIntents.create({
      amount: productToOrder.price * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    if (!paymentIntent.id) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to process payment'
      );
    }

    // Step 4: Update Order with payment status
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
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getOrders = async (user: IUser, query: Record<string, unknown>) => {
  console.log('user', user); // geting user successfully

  const customer = await User.findOne({
    _id: user.userId,
  });

  console.log('customer....', customer); // geting customer successfully

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Customer not found');
  }

  const { role } = customer;
  console.log('role', role); // geting role successfully
  let orders;
  console.log('orders', orders); // geting orders successfully

  if (role === UserRole.CUSTOMER) {
    orders = await Order.find({ customerId: customer._id })
      .populate('meals')
      .populate('mealProviderId');
  } else if (role === UserRole.MEAL_PROVIDER) {
    orders = await Order.find({ mealProviderId: customer._id })
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
