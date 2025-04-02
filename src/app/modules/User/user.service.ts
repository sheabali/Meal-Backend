import { StatusCodes } from 'http-status-codes';
import { IUser, UserRole } from './user.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import User from './user.model';
import Customer from '../Customer/customer.modal';
import { AuthService } from '../Auth/auth.service';

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

export const UserServices = {
  registerUser,
};
