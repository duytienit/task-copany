
import React, { ComponentType, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './reduxHooks';
import { selectIsAuthenticated, selectUserRole } from '@/features/auth/authSlice';
import { Alert } from '@/components/ui/alert';
import { validateUserRole } from '@/services/authService';

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
              <h4 className="text-lg font-medium mb-2">Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <p className="mt-2">Your role: {userRole}</p>
              <p>Required role(s): {requiredRoles.join(', ')}</p>
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
