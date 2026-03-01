import { Request } from 'express';

export interface JwtPayload {
  email: string;

  iat?: number;

  exp?: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
