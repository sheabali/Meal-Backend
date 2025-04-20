import { StatusCodes } from 'http-status-codes';
import { IAuth, IJwtPayload } from './auth.interface';
import { createToken } from './auth.utils';
import config from '../../config';
import mongoose from 'mongoose';
import User from '../User/user.model';
import AppError from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const loginUser = async (payload: IAuth) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findOne({ email: payload.email }).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
    }

    if (!user.isActive) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!');
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Password does not match');
    }

    const jwtPayload: IJwtPayload = {
      userId: user._id as string,
      name: user.name as string,
      email: user.email as string,
      isActive: user.isActive,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    const updateUserInfo = await User.findByIdAndUpdate(
      user._id,
      { clientInfo: payload.clientInfo, lastLogin: Date.now() },
      { new: true, session }
    );

    await session.commitTransaction();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  console.log(
    '🚀 ~ file: auth.service.ts:66 ~ changePassword ~ payload:',
    payload
  );
  console.log(
    '🚀 ~ file: auth.service.ts:66 ~ changePassword ~ userData:',
    userData
  );

  // Checking if the user exists
  const user = (await User.isUserExistsByCustomId(userData.userId)) as {
    password: string;
  };
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
  }

  // Checking if the old password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload.oldPassword,
    user?.password
  );
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Password does not match!');
  }

  // Hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // Update the user's password in the database
  await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );

  return null;
};

export const AuthService = {
  loginUser,
  changePassword,
};
