import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';

export type JwtPayload = {
  sub: string; // userId as string
  role: UserRole;
};

export function signAccessToken(payload: JwtPayload, secret: string, expiresIn: string) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAccessToken(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}
