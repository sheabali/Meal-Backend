import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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

export const Review = model<IReview>('Review', ReviewSchema);
// This schema defines the structure of a review document in MongoDB.
