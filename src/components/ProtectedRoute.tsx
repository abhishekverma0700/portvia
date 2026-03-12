import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
