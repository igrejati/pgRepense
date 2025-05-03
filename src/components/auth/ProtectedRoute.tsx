
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'leader' | 'pastor';
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Always render children without any authentication checks
  return <>{children}</>;
};
