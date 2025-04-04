import { model, Schema } from 'mongoose';
import { IMeal } from './meal.interface';

const MealSchema = new Schema<IMeal>(
  {
    mealProviderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Description too long'],
    },
    image: { type: String },
    ingredients: { type: [String], required: true },
    portionSize: { type: String, required: true },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least 1 BDT'],
    },
    availability: { type: Boolean, default: true },
    ratings: { type: Number, default: 0.0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Meal = model<IMeal>('Meal', MealSchema);
