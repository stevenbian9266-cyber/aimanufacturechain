import { z } from 'zod';

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

export const ApiOkSchema = z.object({
  ok: z.literal(true),
  data: z.any(),
});

export const ApiFailSchema = z.object({
  ok: z.literal(false),
  error: ApiErrorSchema,
});

export const ApiResponseSchema = z.union([ApiOkSchema, ApiFailSchema]);

export type ApiOk<T> = { ok: true; data: T };
export type ApiFail = { ok: false; error: { code: string; message: string; details?: unknown } };
export type ApiResponse<T> = ApiOk<T> | ApiFail;
