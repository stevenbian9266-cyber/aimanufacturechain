import type { UserRole, CompanyMemberRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      auth?: {
        userId: bigint;
        role: UserRole;
        activeCompanyId?: bigint;
        memberRole?: CompanyMemberRole;
      };
    }
  }
}

export {};
