import type { ApiFail, ApiOk } from '@mfg/shared';

export function ok<T>(data: T): ApiOk<T> {
  return { ok: true, data };
}

export function fail(code: string, message: string, details?: unknown): ApiFail {
  return { ok: false, error: { code, message, details } };
}
