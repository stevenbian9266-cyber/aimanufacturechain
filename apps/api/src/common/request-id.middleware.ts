import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function RequestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  // attach to req for later use
  (req as any).requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
