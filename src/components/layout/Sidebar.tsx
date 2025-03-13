
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout, selectUserRole } from '@/features/auth/authSlice';
import { validateUserRole } from '@/services/authService';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
        active 
          ? "bg-primary-500 text-white" 
          : "hover:bg-primary-50 text-gray-700"
      )}
      onClick={onClick}
    >
      <div className="text-xl">{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectUserRole);

  // Define which menu items are visible to which roles
  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/dashboard',
      roles: ['Admin', 'Manager', 'Employee'], // Accessible to all roles
    },
    {
      icon: <FolderKanban size={20} />,
      label: 'Projects',
      path: '/projects',
      roles: ['Admin', 'Manager', 'Employee'], // Accessible to all roles
    },
    {
      icon: <CheckSquare size={20} />,
      label: 'Tasks',
      path: '/tasks',
      roles: ['Admin', 'Manager', 'Employee'], // Accessible to all roles
    },
    {
      icon: <Users size={20} />,
      label: 'Users',
      path: '/users',
      roles: ['Admin', 'Manager'], // Only admin and managers can manage users
    },
    {
      icon: <Shield size={20} />,
      label: 'Admin Panel',
      path: '/admin',
      roles: ['Admin'], // Only admin can access
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      path: '/settings',
      roles: ['Admin', 'Manager', 'Employee'], // Accessible to all roles
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    validateUserRole(item.roles, userRole)
  );

  return (
    <div className="h-screen w-64 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-500">TaskTrove</h1>
        {userRole && (
          <div className="mt-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-1 inline-block">
            {userRole}
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 space-y-1">
        {filteredMenuItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
