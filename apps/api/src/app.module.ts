import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { RolesGuard } from './common/auth/roles.guard';
import { CompanyContextGuard } from './common/auth/company-context.guard';
import { GovernanceModule } from './modules/governance/governance.module';

@Module({
  imports: [PrismaModule, GovernanceModule, AuthModule, HealthModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CompanyContextGuard },
  ],
})
export class AppModule {}
