import { ErrorCodes } from '@mfg/shared';
import type { CompanyMemberRole, UserRole } from '@prisma/client';
import { AppError } from '../app-error';

export type AuthCtx = {
  userId: bigint;
  role: UserRole;
  activeCompanyId?: bigint;
  memberRole?: CompanyMemberRole;
};

export function assertRole(ctx: AuthCtx, allowed: UserRole[]) {
  if (!allowed.includes(ctx.role)) {
    throw new AppError(ErrorCodes.FORBIDDEN, 'Forbidden', 403);
  }
}

export function assertCompanyContext(ctx: AuthCtx) {
  if (!ctx.activeCompanyId) {
    throw new AppError(ErrorCodes.COMPANY_CONTEXT_REQUIRED, 'Company context required', 400);
  }
}

export function assertCompanyMember(ctx: AuthCtx) {
  assertCompanyContext(ctx);
  if (!ctx.memberRole) {
    throw new AppError(ErrorCodes.NOT_COMPANY_MEMBER, 'Not a company member', 403);
  }
}
