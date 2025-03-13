
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
