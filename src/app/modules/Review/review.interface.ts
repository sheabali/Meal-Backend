import { Types } from 'mongoose';

export interface IReview {
  userId: Types.ObjectId;
  mealId: Types.ObjectId;
  comment: string;
  rating: number;
  isDeleted?: boolean;
}
