import { model, Schema } from 'mongoose';
import { IAddress } from './address.interface';

const AddressSchema = new Schema<IAddress>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId code is required'],
    },
    zipCode: {
      type: String,
      required: [true, 'zip code is required'],
    },
    pickupStreet: {
      type: String,
      required: [true, 'pickup street is required'],
    },
    houseNo: {
      type: String,
      required: [true, 'house no. is required'],
    },
    city: {
      type: String,
      required: [true, 'city is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Address = model<IAddress>('Address', AddressSchema);
