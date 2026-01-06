import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export type AuditAction =
  | 'AUTH_REGISTER'
  | 'AUTH_LOGIN'
  | 'CONTACT_UNLOCK'
  | 'AI_CONTEXT_INJECTED'
  | 'AI_CHAT'
  | 'BOM_CREATED'
  | 'LEAD_CREATED'
  | string;

export type AuditEntityType =
  | 'user'
  | 'company'
  | 'bom'
  | 'lead'
  | 'conversation'
  | 'ai'
  | string;

export type AuditCtx = {
  requestId?: string;
  actorUserId?: bigint;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(ctx: AuditCtx, action: AuditAction, entityType: AuditEntityType, entityId: string, meta?: unknown) {
    const metaJson = {
      requestId: ctx.requestId ?? null,
      ...(meta ? { meta } : {}),
    };

    await this.prisma.auditLog.create({
      data: {
        actorUserId: ctx.actorUserId ?? null,
        action,
        entityType,
        entityId,
        metaJson: metaJson as any,
      },
    });
  }
}
