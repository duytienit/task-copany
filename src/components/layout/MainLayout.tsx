
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/reduxHooks';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
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
