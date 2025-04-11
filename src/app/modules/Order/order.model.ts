import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer id is required'],
    },
    meals: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: [true, 'Meal id is required'],
    },
    mealProviderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Meal provider id is required'],
    },
    amount: { type: Number, required: [true, 'Amount is required'] },
    customization: String,
    schedule: { type: Date, required: [true, 'Schedule Date is required'] },
    deliveryAddress: {
      type: String,
      required: [true, 'Address is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING',
    },
    paymentIntentId: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', OrderSchema);
