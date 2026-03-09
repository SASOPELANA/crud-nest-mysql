import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../interfaces/request.auth';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) {
      return true;
    }

    //console.log(role); // --> debug

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    // con este if, le damos todo tipo de persimos al ADMIN
    // Al ser el rol de ADMIN el mas alto, le damos acceso a todos los endpoints sin importar el rol que se le haya asignado en el decorador de roles,
    // ya que el ADMIN tiene acceso a todo
    if (user.role === Role.ADMIN) {
      return true;
    }

    return role.includes(user.role);
  }
}
