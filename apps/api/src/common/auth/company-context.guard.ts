import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCodes } from '@mfg/shared';
import { AppError } from '../app-error';
import { PrismaService } from '../../prisma/prisma.service';
import { AUTH_META_REQUIRE_COMPANY } from './constants';

@Injectable()
export class CompanyContextGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireCompany = this.reflector.getAllAndOverride<boolean>(AUTH_META_REQUIRE_COMPANY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireCompany) return true;

    const req = context.switchToHttp().getRequest<any>();
    const auth = req.auth;
    if (!auth?.userId) {
      throw new AppError(ErrorCodes.AUTH_REQUIRED, 'Authentication required', 401);
    }

    const headerCompanyId = (req.headers['x-company-id'] as string | undefined)?.trim();
    if (!headerCompanyId) {
      throw new AppError(ErrorCodes.COMPANY_CONTEXT_REQUIRED, 'Missing X-Company-Id header', 400);
    }

    let companyId: bigint;
    try {
      companyId = BigInt(headerCompanyId);
    } catch {
      throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Invalid X-Company-Id', 400);
    }

    const membership = await this.prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId: auth.userId } },
    });

    if (!membership) {
      throw new AppError(ErrorCodes.NOT_COMPANY_MEMBER, 'Not a company member', 403);
    }

    req.auth.activeCompanyId = companyId;
    req.auth.memberRole = membership.memberRole;

    return true;
  }
}
