
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

const AuthLayout: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  
  // Redirect to the page they tried to visit or to dashboard if they're already logged in
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white text-center md:text-left">
        <h1 className="text-xl font-bold text-primary-500">TaskTrove</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
