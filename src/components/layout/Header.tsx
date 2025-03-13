
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';

const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="text-gray-600 cursor-pointer" size={20} />
          <span className="absolute -top-1 -right-1 bg-accent-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
            3
          </span>
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={18} className="text-primary-500" />
            </div>
          )}
          <span className="font-medium text-gray-700">{user?.name || 'Guest'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
