import { Request } from 'express';

export interface JwtPayload {
  email: string;

  role: string; // --> debe ser obligatorio para poder validar el role del usuario en el endpoint de profile

  iat?: number;

  exp?: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
