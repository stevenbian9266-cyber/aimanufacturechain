import { SetMetadata } from '@nestjs/common';
import { AUTH_META_PUBLIC } from './constants';

export const Public = () => SetMetadata(AUTH_META_PUBLIC, true);
