import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../Auth/auth.interface';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(
    req.body,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created succesfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
};
