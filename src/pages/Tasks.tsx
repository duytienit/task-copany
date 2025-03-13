
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchTasksSuccess } from '@/features/tasks/tasksSlice';
import { fetchUsersSuccess } from '@/features/users/usersSlice';
import { fetchProjectsSuccess } from '@/features/projects/projectsSlice';
import mockData from '@/data/mock-data.json';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);
  const { users } = useAppSelector((state) => state.users);
  const { projects } = useAppSelector((state) => state.projects);
  
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    dispatch(fetchTasksSuccess(mockData.tasks));
    dispatch(fetchUsersSuccess(mockData.users));
    dispatch(fetchProjectsSuccess(mockData.projects));
  }, [dispatch]);
  
  const getFilteredTasks = () => {
    if (activeTab === 'all') return tasks;
    if (activeTab === 'todo') return tasks.filter(task => task.status === 'To Do');
    if (activeTab === 'in-progress') return tasks.filter(task => task.status === 'In Progress');
    if (activeTab === 'completed') return tasks.filter(task => task.status === 'Completed');
    return tasks;
  };
  
  const getUser = (userId: string) => {
    return users.find(user => user.id === userId);
  };
  
  const getProject = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-600">Manage your task list</p>
        </div>
        
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          <span>Filter</span>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <Card className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => {
                const assignedUser = getUser(task.assignedTo);
                const project = getProject(task.projectId);
                
                return (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full ${
                        task.status === 'Completed' 
                          ? 'bg-green-100 text-green-500' 
                          : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-500'
                            : 'bg-gray-100 text-gray-500'
                      } flex items-center justify-center`}>
                        {task.status === 'Completed' ? (
                          <CheckCircle2 size={16} />
                        ) : task.status === 'In Progress' ? (
                          <Clock size={16} />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              task.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : task.priority === 'Medium'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-sm text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Project:</span>
                            <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full">
                              {project?.name || 'Unknown Project'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">Assigned to:</span>
                            <div className="flex items-center gap-2">
                              {assignedUser ? (
                                <>
                                  <img
                                    src={assignedUser.avatar}
                                    alt={assignedUser.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className="text-xs font-medium">
                                    {assignedUser.name}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs">Unassigned</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredTasks.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No tasks found</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
