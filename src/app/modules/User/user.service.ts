import { StatusCodes } from 'http-status-codes';
import { IUser, UserRole } from './user.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import User from './user.model';
import Customer from '../Customer/customer.modal';
import { AuthService } from '../Auth/auth.service';
import { IJwtPayload } from '../Auth/auth.interface';
import auth from '../../middlewares/auth';

// Function to register user
const registerUser = async (userData: IUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if ([UserRole.MEAL_PROVIDER].includes(userData.role)) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        'Invalid role. Only User is allowed.'
      );
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: userData.email }).session(
      session
    );
    if (existingUser) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        'Email is already registered'
      );
    }

    // Create the user
    const user = new User(userData);
    const createdUser = await user.save({ session });

    const profile = new Customer({
      user: createdUser._id,
    });
    await profile.save({ session });

    session.commitTransaction();
    return await AuthService.loginUser({
      email: createdUser.email,
      password: userData.password,
      clientInfo: userData.clientInfo,
    });
  } catch (err: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    session.endSession();
  }
};

const updateCustomerProfile = async (
  payload: Partial<IUser>,
  user: Partial<IUser>
) => {
  const isCustomerExists = await User.findOne({
    _id: user.userId,
    role: UserRole.CUSTOMER,
  });
  if (!isCustomerExists) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid customer');
  }
  const updatedUser = await User.findByIdAndUpdate(user.userId, payload, {
    new: true,
  });
  return updatedUser;
};

const updateProviderProfile = async (
  payload: Partial<IUser>,
  user: Partial<IUser>
) => {
  const isProviderExists = await User.findOne({
    _id: user.userId,
    role: UserRole.MEAL_PROVIDER,
  });
  if (!isProviderExists) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid provider');
  }
  const updatedUser = await User.findByIdAndUpdate(user.userId, payload, {
    new: true,
  });
  console.log('updatedUser', updatedUser);
  return updatedUser;
};
const getSingleUser = async (id: string, authUser: IJwtPayload) => {
  console.log(authUser, 'authUser');
  const user = await User.findOne({
    _id: authUser?.userId,
    role: authUser?.role,
  });
  console.log(user, 'user');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid Customer');
  }
  const meal = await User.findById(id);
  if (!meal) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Uesr not found');
  }
  const result = await User.findById(id);
  return result;
};

export const UserServices = {
  registerUser,
  updateCustomerProfile,
  updateProviderProfile,
  getSingleUser,
};
