import { Document, Model, ObjectId, Types } from 'mongoose';

// Enum for User Roles
export enum UserRole {
  CUSTOMER = 'customer',
  MEAL_PROVIDER = 'provider',
}

// User Schema Definition
export interface IUser extends Document {
  [x: string]: any | ObjectId;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  clientInfo: {
    device: 'pc' | 'mobile'; // Device type
    browser: string; // Browser name
    ipAddress: string; // User IP address
    pcName?: string; // Optional PC name
    os?: string; // Optional OS name (Windows, MacOS, etc.)
    userAgent?: string; // Optional user agent string
  };
  lastLogin: Date;
  dietaryPreferences?: string[]; // for customers
  cuisineSpecialties?: string[]; // for providers
  isActive: boolean;
  otpToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByCustomId(userId: any): unknown;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isUserExistsByEmail(id: string): Promise<IUser>;
  checkUserExist(userId: string): Promise<IUser>;
}
