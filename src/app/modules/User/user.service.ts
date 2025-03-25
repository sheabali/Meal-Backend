import { StatusCodes } from 'http-status-codes';
import { IUser, UserRole } from './user.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import User from './user.model';
import Customer from '../Customer/customer.modal';

// Function to register user
const registerUser = async (userData: IUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if ([UserRole.ADMIN].includes(userData.role)) {
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
  } catch (err: any) {
    console.log(err);
  }
};

export const UserServices = {
  registerUser,
  // createFacultyIntoDB,
  // createAdminIntoDB,
};
