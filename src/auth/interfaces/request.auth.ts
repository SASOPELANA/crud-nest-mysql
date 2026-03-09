import { Request } from 'express';
import { Role } from '../../common/enums/rol.enum';

export interface JwtPayload {
  email: string;

  role: Role; // --> debe ser obligatorio para poder validar el role del usuario en el endpoint de profile

  iat?: number;

  exp?: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
