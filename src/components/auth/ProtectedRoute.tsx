
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'leader' | 'pastor';
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLeader, isPastor, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-repense-red" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'pastor' && !isPastor) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'leader' && !isLeader) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
