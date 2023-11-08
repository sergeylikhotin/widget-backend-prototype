import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuardedRequest } from '../types/shared';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role['id'][]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role['id'][]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<GuardedRequest>();
    return requiredRoles.some((roleId) => user.roleId?.includes(roleId));
  }
}
