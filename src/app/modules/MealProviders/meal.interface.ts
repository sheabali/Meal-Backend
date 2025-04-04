import { Schema, model, Document, Types } from 'mongoose';

export interface IMeal extends Document {
  mealProviderId: Types.ObjectId;
  name: string;
  description: string;
  image?: string;
  ingredients: string[];
  portionSize: string;
  price: number;
  availability?: boolean;
  ratings?: number;
  totalRatings?: number;
  isDeleted?: boolean;
}
