export type AuthContext = {
  userId?: string;
  role?: 'ADMIN' | 'BUYER' | 'SUPPLIER';
  activeCompanyId?: string;
  requestId: string;
};
