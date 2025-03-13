
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchProjectsSuccess } from '@/features/projects/projectsSlice';
import { fetchTasksSuccess } from '@/features/tasks/tasksSlice';
import { fetchUsersSuccess } from '@/features/users/usersSlice';
import mockData from '@/data/mock-data.json';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Clock,
  BarChart,
  Users,
  FolderKanban
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);
  const { users } = useAppSelector((state) => state.users);
  
  useEffect(() => {
    dispatch(fetchProjectsSuccess(mockData.projects));
    dispatch(fetchTasksSuccess(mockData.tasks));
    dispatch(fetchUsersSuccess(mockData.users));
  }, [dispatch]);
  
  const getTaskStatusCounts = () => {
    return tasks.reduce(
      (acc, task) => {
        if (task.status === 'Completed') acc.completed++;
        if (task.status === 'In Progress') acc.inProgress++;
        if (task.status === 'To Do') acc.todo++;
        return acc;
      },
      { completed: 0, inProgress: 0, todo: 0 }
    );
  };
  
  const taskStatusCounts = getTaskStatusCounts();
  const totalTasks = tasks.length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your project management dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <h3 className="text-2xl font-bold mt-1">{projects.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FolderKanban className="text-primary-500" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={65} className="h-1.5" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {projects.filter(p => p.status === 'In Progress').length} in progress
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <h3 className="text-2xl font-bold mt-1">{totalTasks}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="text-secondary-500" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              value={(taskStatusCounts.completed / totalTasks) * 100} 
              className="h-1.5" 
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {taskStatusCounts.completed} completed
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex -space-x-2">
              {users.slice(0, 5).map((user) => (
                <img
                  key={user.id}
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Active team
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
              <h3 className="text-2xl font-bold mt-1">5</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="text-accent-500" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={40} className="h-1.5" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            3 this week
          </p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <FolderKanban className="text-primary-500" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{project.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress 
                      value={project.progress} 
                      className="h-1.5 flex-1" 
                    />
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  <span className={`px-2 py-1 rounded-full ${
                    project.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Recent Tasks</h3>
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-start gap-4">
                <div className={`mt-1 relative w-4 h-4 rounded-full ${
                  task.status === 'Completed' 
                    ? 'bg-green-500' 
                    : task.status === 'In Progress'
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                }`}>
                  {task.status === 'Completed' && (
                    <CheckCircle2 className="absolute -top-0.5 -left-0.5 text-green-500" size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Due on {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  <span className={`px-2 py-1 rounded-full ${
                    task.priority === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : task.priority === 'Medium'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
