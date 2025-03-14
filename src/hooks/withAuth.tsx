
import React, { ComponentType, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';
import { selectIsAuthenticated, selectUserRole } from '@/features/auth/authSlice';
import { Alert } from '@/components/ui/alert';
import { validateUserRole } from '@/services/authService';
import { Shield, AlertTriangle } from 'lucide-react';

interface WithAuthOptions {
  requiredRoles?: string[];
}

export const withAuth = <P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const { requiredRoles } = options;
  
  const WithAuthComponent: React.FC<P> = (props) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userRole = useAppSelector(selectUserRole);
    const location = useLocation();
    
    // Check authentication
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    
    // Check role-based access if roles are specified
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = validateUserRole(requiredRoles, userRole);
      
      if (!hasRequiredRole) {
        return (
          <div className="h-full flex items-center justify-center p-6">
            <Alert variant="destructive" className="max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5" />
                <h4 className="text-lg font-medium">Access Denied</h4>
              </div>
              <p>You don't have permission to access this page.</p>
              <div className="mt-4 p-2 bg-destructive/20 rounded-md">
                <p className="text-sm">Your role: <span className="font-medium">{userRole}</span></p>
                <p className="text-sm">Required role(s): <span className="font-medium">{requiredRoles.join(', ')}</span></p>
              </div>
            </Alert>
          </div>
        );
      }
    }
    
    return <Component {...props} />;
  };
  
  return WithAuthComponent;
};

export default withAuth;
