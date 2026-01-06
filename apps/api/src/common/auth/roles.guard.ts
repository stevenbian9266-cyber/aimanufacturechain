import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '@prisma/client';
import { ErrorCodes } from '@mfg/shared';
import { AppError } from '../app-error';
import { AUTH_META_ROLES } from './constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(AUTH_META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;

    const req = context.switchToHttp().getRequest<any>();
    const role = req.auth?.role as UserRole | undefined;

    if (!role) {
      throw new AppError(ErrorCodes.AUTH_REQUIRED, 'Authentication required', 401);
    }
    if (!roles.includes(role)) {
      throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
    }
    return true;
  }
}
