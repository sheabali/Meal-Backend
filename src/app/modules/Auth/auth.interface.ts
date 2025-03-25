import { UserRole } from '../User/user.interface';

export interface IAuth {
  email: string;
  password: string;
  clientInfo: {
    device: 'pc' | 'mobile'; // Device type
    browser: string; // Browser name
    ipAddress: string; // User IP address
    pcName?: string; // Optional PC name
    os?: string; // Optional OS name (Windows, MacOS, etc.)
    userAgent?: string; // Optional user agent string
  };
}

export interface IJwtPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
