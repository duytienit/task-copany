
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { fetchTasksSuccess } from '@/features/tasks/tasksSlice';
import { fetchProjectsSuccess } from '@/features/projects/projectsSlice';
import { fetchUsersSuccess } from '@/features/users/usersSlice';
import mockData from '@/data/mock-data.json';

const MainLayout: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Initialize data and simulate real-time notifications
  useEffect(() => {
    // Initial data load
    dispatch(fetchTasksSuccess(mockData.tasks));
    dispatch(fetchProjectsSuccess(mockData.projects));
    dispatch(fetchUsersSuccess(mockData.users));
    
    // Simulate a new task assignment after 5 seconds
    const timer = setTimeout(() => {
      const newTask = {
        id: `task-${Date.now()}`,
        title: "New task assigned",
        description: "You have been assigned a new priority task",
        status: "To Do",
        priority: "High",
        projectId: "project-1",
        assignedTo: "user-1",
        createdBy: "user-5",
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
      };
      
      // Add the new task to our tasks store
      dispatch(fetchTasksSuccess([...mockData.tasks, newTask]));
      
      // Show a notification toast
      toast({
        title: "New Task Assigned",
        description: "You have been assigned a new priority task",
        variant: "default",
      });
      
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [dispatch, toast]);
  
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
        <Toaster />
      </div>
    </div>
  );
};

export default MainLayout;
