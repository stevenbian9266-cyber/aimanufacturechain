import { z } from 'zod';
import { ErrorCodes } from '@mfg/shared';
import { AppError } from './app-error';

export function validateOrThrow<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Validation error', 400, parsed.error.flatten());
  }
  return parsed.data;
}
