import { Types } from 'mongoose';

export interface IAddress {
  customerId?: Types.ObjectId;
  zipCode: string;
  pickupStreet: string;
  houseNo: string;
  city: string;
  isDeleted?: boolean;
}
