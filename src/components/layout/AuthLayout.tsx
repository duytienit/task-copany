
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/reduxHooks';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
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
