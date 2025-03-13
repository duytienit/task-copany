
import React, { useEffect, useState } from 'react';
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
  FolderKanban,
  ArrowUpRight,
  CalendarDays,
  BarChart4
} from 'lucide-react';
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);
  const { users } = useAppSelector((state) => state.users);
  const [activityLogs, setActivityLogs] = useState<Array<{id: string, message: string, time: string}>>([]);
  
  useEffect(() => {
    dispatch(fetchProjectsSuccess(mockData.projects));
    dispatch(fetchTasksSuccess(mockData.tasks));
    dispatch(fetchUsersSuccess(mockData.users));
    
    // Generate mock activity logs
    const generateActivityLogs = () => {
      const actions = ['created', 'updated', 'completed', 'commented on'];
      const items = ['task', 'project', 'document', 'meeting'];
      
      return Array(5).fill(null).map((_, i) => {
        const randomUser = mockData.users[Math.floor(Math.random() * mockData.users.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        const hoursAgo = Math.floor(Math.random() * 24);
        
        return {
          id: `log-${i}`,
          message: `${randomUser.name} ${randomAction} a ${randomItem}`,
          time: `${hoursAgo}h ago`
        };
      });
    };
    
    setActivityLogs(generateActivityLogs());
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
  
  // Data for task status chart
  const taskStatusData = [
    { name: 'Completed', value: taskStatusCounts.completed },
    { name: 'In Progress', value: taskStatusCounts.inProgress },
    { name: 'To Do', value: taskStatusCounts.todo },
  ];
  
  // Data for project progress chart
  const projectProgressData = projects.map(project => ({
    name: project.name.split(' ')[0],
    progress: project.progress
  }));

  // Colors for charts
  const COLORS = ['#10B981', '#3B82F6', '#6B7280'];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your project management dashboard</p>
      </div>
      
      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover-scale">
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
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {projects.filter(p => p.status === 'In Progress').length} in progress
            </p>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <ArrowUpRight size={14} />
              <span className="ml-1">12%</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover-scale">
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
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {taskStatusCounts.completed} completed
            </p>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <ArrowUpRight size={14} />
              <span className="ml-1">8%</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover-scale">
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
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Active team
            </p>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <ArrowUpRight size={14} />
              <span className="ml-1">2 new</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover-scale">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
              <h3 className="text-2xl font-bold mt-1">5</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <CalendarDays className="text-accent-500" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={40} className="h-1.5" />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              3 this week
            </p>
            <div className="flex items-center text-xs text-orange-600 font-medium">
              <Clock size={14} />
              <span className="ml-1">Urgent</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts & Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Project Progress</h3>
            <BarChart4 size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartBarChart
                data={projectProgressData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3B82F6" />
              </RechartBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Task Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Task Status</h3>
            <BarChart size={20} className="text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Recent Activities & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4">
                <div className="bg-gray-100 rounded-full p-2 mt-1">
                  <Clock className="text-gray-500" size={16} />
                </div>
                <div>
                  <p className="text-sm">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.time}</p>
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
