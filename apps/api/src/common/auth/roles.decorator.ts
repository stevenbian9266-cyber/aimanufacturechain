import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@prisma/client';
import { AUTH_META_ROLES } from './constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(AUTH_META_ROLES, roles);
