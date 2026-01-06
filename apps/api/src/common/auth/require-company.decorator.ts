import { SetMetadata } from '@nestjs/common';
import { AUTH_META_REQUIRE_COMPANY } from './constants';

export const RequireCompany = () => SetMetadata(AUTH_META_REQUIRE_COMPANY, true);
