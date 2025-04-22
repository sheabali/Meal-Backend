import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../Auth/auth.interface';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { IUser } from '../User/user.interface';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder({
    ...req.body,
    user: req.user as IJwtPayload,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created succesfully',
    data: result,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getOrders(req.user as IUser, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});
const updateOrderStatus = catchAsync(async (req, res) => {
  const result = await OrderService.updateOrderStatus(
    req.body.status as 'PENDING' | 'ACCEPTED' | 'DELIVERED' | 'CANCELLED',
    req.params.id as string // Replace 'orderId' with the actual parameter name
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Orders updated successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
