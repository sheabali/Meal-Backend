import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { Request, Response } from 'express';
import config from '../../config';

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

export const UserControllers = {
  registerUser,
  // createFaculty,
  // createAdmin,
};
