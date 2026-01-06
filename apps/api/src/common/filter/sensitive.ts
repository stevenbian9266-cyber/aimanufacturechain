/**
 * Field-level filtering helpers.
 * IMPORTANT: Field-level filtering MUST be enforced on the server.
 */

const CONTACT_FIELDS = ['email', 'phone', 'whatsapp', 'wechat', 'address'] as const;

export function filterContactFields<T extends Record<string, any>>(obj: T, canViewContact: boolean): T {
  if (canViewContact) return obj;

  const clone: any = { ...obj };
  for (const k of CONTACT_FIELDS) {
    if (k in clone) delete clone[k];
  }
  return clone as T;
}
