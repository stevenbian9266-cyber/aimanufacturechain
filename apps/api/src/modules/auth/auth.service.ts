import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '@mfg/shared';
import type { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AppError } from '../../common/app-error';
import { hashPassword, verifyPassword } from './password';
import { signAccessToken } from '../../common/auth/jwt';
import { AuditService } from '../governance/audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async register(input: {
    email: string;
    password: string;
    role: UserRole;
    companyName?: string;
    requestId?: string;
  }) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new AppError(ErrorCodes.EMAIL_ALREADY_EXISTS, 'Email already exists', 409);
    }

    const passwordHash = await hashPassword(input.password);

    // For BUYER/SUPPLIER, create a company and OWNER membership by default.
    // For ADMIN, no company is created by default.
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: input.role,
          status: 'ACTIVE',
        },
      });

      let companyId: bigint | null = null;

      if (input.role !== 'ADMIN') {
        const company = await tx.company.create({
          data: {
            name: input.companyName || `${input.email.split('@')[0]}'s company`,
            status: 'ACTIVE',
          },
        });

        await tx.companyMember.create({
          data: {
            companyId: company.id,
            userId: user.id,
            memberRole: 'OWNER',
          },
        });

        companyId = company.id;
      }

      return { user, companyId };
    });

    const secret = process.env.JWT_ACCESS_SECRET || 'dev-secret';
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '7d';
    const token = signAccessToken({ sub: result.user.id.toString(), role: result.user.role }, secret, expiresIn);

    await this.audit.log(
      { actorUserId: result.user.id, requestId: input.requestId },
      'AUTH_REGISTER',
      'user',
      result.user.id.toString(),
      { role: result.user.role, companyId: result.companyId?.toString() ?? null },
    );

    return {
      token,
      user: { id: result.user.id.toString(), email: result.user.email, role: result.user.role },
      companyId: result.companyId?.toString() ?? null,
    };
  }

  async login(input: { email: string; password: string; requestId?: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'Invalid credentials', 401);
    }
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) {
      throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'Invalid credentials', 401);
    }

    const secret = process.env.JWT_ACCESS_SECRET || 'dev-secret';
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '7d';
    const token = signAccessToken({ sub: user.id.toString(), role: user.role }, secret, expiresIn);

    await this.audit.log({ actorUserId: user.id, requestId: input.requestId }, 'AUTH_LOGIN', 'user', user.id.toString(), {
      role: user.role,
    });

    return {
      token,
      user: { id: user.id.toString(), email: user.email, role: user.role },
    };
  }

  async me(userId: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });
    if (!user) throw new AppError(ErrorCodes.AUTH_REQUIRED, 'User not found', 401);

    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      preferredLang: user.preferredLang,
      memberships: user.memberships.map((m) => ({
        companyId: m.companyId.toString(),
        companyName: m.company.name,
        memberRole: m.memberRole,
      })),
    };
  }
}
