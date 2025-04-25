import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { Request, Response } from 'express';
import config from '../../config';
import { get } from 'mongoose';
import { IJwtPayload } from '../Auth/auth.interface';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.registerUser(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User registration completed successfully!',
    data: {
      accessToken,
    },
  });
});

const updateCustomerProfile = catchAsync(async (req, res) => {
  const result = await UserServices.updateCustomerProfile(req.body, req.user);
  sendResponse(res, {
    success: true,
    message: 'Profile updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateProviderProfile = catchAsync(async (req, res) => {
  const result = await UserServices.updateProviderProfile(req.body, req.user);
  sendResponse(res, {
    success: true,
    message: 'Profile updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.getSingleUser(id, req.user as IJwtPayload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'profile are retrieved successfully',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  updateCustomerProfile,
  updateProviderProfile,
  getSingleUser,
  // createFaculty,
  // createAdmin,
};
