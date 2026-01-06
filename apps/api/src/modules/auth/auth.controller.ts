import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { z } from 'zod';
import type { UserRole } from '@prisma/client';
import { ok } from '../../common/response';
import { validateOrThrow } from '../../common/validate';
import { Public } from '../../common/auth/public.decorator';
import { RequireCompany } from '../../common/auth/require-company.decorator';
import { AuthService } from './auth.service';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'BUYER', 'SUPPLIER']),
  companyName: z.string().min(2).max(120).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  async register(@Req() req: any, @Body() body: unknown) {
    const data = validateOrThrow(RegisterSchema, body);
    const result = await this.auth.register({
      email: data.email,
      password: data.password,
      role: data.role as UserRole,
      companyName: data.companyName,
      requestId: req.requestId,
    });
    return ok(result);
  }

  @Public()
  @Post('login')
  async login(@Req() req: any, @Body() body: unknown) {
    const data = validateOrThrow(LoginSchema, body);
    const result = await this.auth.login({ ...data, requestId: req.requestId });
    return ok(result);
  }

  @Get('me')
  async me(@Req() req: any) {
    const userId = req.auth?.userId as bigint | undefined;
    const result = await this.auth.me(userId!);
    return ok(result);
  }

  /**
   * ✅ ABAC template endpoint:
   * This route requires company context and validates membership via `X-Company-Id`.
   */
  @RequireCompany()
  @Get('company')
  async company(@Req() req: any) {
    return ok({
      companyId: req.auth.activeCompanyId.toString(),
      memberRole: req.auth.memberRole,
    });
  }
}
