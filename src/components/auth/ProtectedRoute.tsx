
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'leader' | 'pastor';
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // For demonstration purposes, just render the children without any authentication checks
  return <>{children}</>;
};
