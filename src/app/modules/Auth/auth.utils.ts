import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from './auth.interface';

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
