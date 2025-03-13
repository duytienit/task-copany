
import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.tasks);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Get the most recent 3 tasks as "notifications"
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3);
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className={`relative w-64 transition-all duration-200 ${isSearchFocused ? 'md:w-96' : ''}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer">
              <Bell className="text-gray-600" size={20} />
              <span className="absolute -top-1 -right-1 bg-accent-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                {recentTasks.length}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 mr-4" align="end">
            <div className="p-2 bg-primary-50 border-b border-gray-200">
              <h4 className="font-medium text-primary-700">Recent Notifications</h4>
            </div>
            <div className="max-h-80 overflow-auto">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <div className="flex items-start gap-2">
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                        task.priority === 'High' ? 'bg-red-500' : 
                        task.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No new notifications
                </div>
              )}
            </div>
            <div className="p-2 border-t border-gray-200 text-center">
              <a href="/tasks" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                View All Tasks
              </a>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center gap-2 cursor-pointer">
          {user?.avatar ? (
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarFallback>
                <User size={18} className="text-primary-500" />
              </AvatarFallback>
            </Avatar>
          )}
          <span className="font-medium text-gray-700 hidden md:inline-block">{user?.name || 'Guest'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
