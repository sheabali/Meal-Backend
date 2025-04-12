import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IUser } from '../User/user.interface';
import User from '../User/user.model';
import { IAddress } from './address.interface';
import { Address } from './address.model';

const createAddress = async (payload: IAddress, user: IUser) => {
  const { customerId, ...addressData } = payload;

  //isAddressExists
  const isAddressExists = await Address.findOne({
    customerId: user.userId,
    ...addressData,
  });
  if (isAddressExists) {
    throw new Error('Address already exists');
  }

  // Validate the user
  const userData = await User.findById(user.userId);
  if (!userData) {
    throw new Error('User not found');
  }

  // Check if the user is a customer
  if (user.role !== 'customer') {
    throw new Error('Only customers can create addresses');
  }

  // Create a new address
  const address = await Address.create({
    customerId: user.userId,
    ...addressData,
  });

  return address;
};

const updateAddress = async (
  payload: Partial<IAddress>,
  user: Partial<IUser>
) => {
  const isUserExists = await User.checkUserExist(user?.userId);
  if (!isUserExists || isUserExists.role !== user.role) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Access denied');
  }
  const isAddressExists = await Address.findOne({
    customerId: isUserExists._id,
  });
  if (!isAddressExists) {
    throw new AppError(StatusCodes.CONFLICT, "Address doesn't exist");
  }
  const address = await Address.findByIdAndUpdate(
    isAddressExists._id,
    payload,
    {
      new: true,
    }
  );
  return address;
};

const getMyAddress = async (user: Partial<IUser>) => {
  const isUserExists = await User.checkUserExist(user?.userId);

  if (!isUserExists || isUserExists.role !== user?.role) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Access denied');
  }
  const address = await Address.findOne({
    customerId: isUserExists._id,
  });
  if (!address) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Address not found');
  }
  return address;
};

export const AddressService = { createAddress, updateAddress, getMyAddress };
