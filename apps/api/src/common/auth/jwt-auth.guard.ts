import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCodes } from '@mfg/shared';
import { AppError } from '../app-error';
import { AUTH_META_PUBLIC } from './constants';
import { PrismaService } from '../../prisma/prisma.service';
import { verifyAccessToken } from './jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_META_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<any>();
    const authz = (req.headers as any)?.authorization as string | undefined;

    if (!authz || !authz.startsWith('Bearer ')) {
      throw new AppError(ErrorCodes.AUTH_REQUIRED, 'Authentication required', 401);
    }

    const token = authz.slice('Bearer '.length).trim();
    const secret = process.env.JWT_ACCESS_SECRET || 'dev-secret';
    let payload: { sub: string; role: any };
    try {
      payload = verifyAccessToken(token, secret);
    } catch {
      throw new AppError(ErrorCodes.AUTH_REQUIRED, 'Invalid token', 401);
    }

    const userId = BigInt(payload.sub);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError(ErrorCodes.AUTH_REQUIRED, 'User not found or inactive', 401);
    }

    (req as any).auth = {
      userId,
      role: user.role,
    };

    return true;
  }
}
