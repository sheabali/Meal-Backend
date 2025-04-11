import { Types, Document } from 'mongoose';

export interface IOrderMeal {
  meal: Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

export interface IOrder {
  paymentMethodId?: string;
  customerId: Types.ObjectId;
  meals: Types.ObjectId;
  mealProviderId: Types.ObjectId;
  amount: number;
  customization: string;
  schedule: Date;
  deliveryAddress: string;
  status: 'PENDING' | 'ACCEPTED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID';
  isDeleted: boolean;
  paymentIntentId?: string;
}
