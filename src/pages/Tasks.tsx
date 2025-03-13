
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchTasksSuccess, updateTask, deleteTask } from '@/features/tasks/tasksSlice';
import { fetchUsersSuccess } from '@/features/users/usersSlice';
import { fetchProjectsSuccess } from '@/features/projects/projectsSlice';
import mockData from '@/data/mock-data.json';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  ChevronDown,
  User,
  Briefcase
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskModal from '@/components/tasks/TaskModal';
import BulkActions from '@/components/tasks/BulkActions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);
  const { users } = useAppSelector((state) => state.users);
  const { projects } = useAppSelector((state) => state.projects);
  const { toast } = useToast();
  
  // State for UI controls
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State for modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // State for columns (for drag and drop)
  const [columns, setColumns] = useState({
    'To Do': [],
    'In Progress': [],
    'Completed': []
  });
  
  // State for kanban view
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  
  useEffect(() => {
    dispatch(fetchTasksSuccess(mockData.tasks));
    dispatch(fetchUsersSuccess(mockData.users));
    dispatch(fetchProjectsSuccess(mockData.projects));
  }, [dispatch]);
  
  // Update columns when tasks change
  useEffect(() => {
    const groupedTasks = {
      'To Do': tasks.filter(task => task.status === 'To Do'),
      'In Progress': tasks.filter(task => task.status === 'In Progress'),
      'Completed': tasks.filter(task => task.status === 'Completed')
    };
    
    setColumns(groupedTasks);
  }, [tasks]);
  
  const getUser = (userId: string) => {
    return users.find(user => user.id === userId);
  };
  
  const getProject = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };
  
  // Filter tasks based on all criteria
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Filter by status tab
    if (activeTab !== 'all') {
      const statusMap = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'completed': 'Completed'
      };
      filtered = filtered.filter(task => task.status === statusMap[activeTab as keyof typeof statusMap]);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        task => 
          task.title.toLowerCase().includes(query) || 
          task.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by project
    if (projectFilter) {
      filtered = filtered.filter(task => task.projectId === projectFilter);
    }
    
    // Filter by assignee
    if (assigneeFilter) {
      filtered = filtered.filter(task => task.assignedTo === assigneeFilter);
    }
    
    return filtered;
  };
  
  const filteredTasks = getFilteredTasks();
  
  // Handler functions
  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsTaskModalOpen(true);
  };
  
  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleDeleteRequest = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete));
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted",
      });
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };
  
  const handleStatusChange = (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      dispatch(updateTask({
        ...task,
        status: newStatus
      }));
      
      toast({
        title: "Task updated",
        description: `Task moved to ${newStatus}`,
      });
    }
  };
  
  const handleSelectTask = (taskId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };
  
  const handleSelectAllTasks = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };
  
  const handleTaskDrop = (taskId: string, targetColumn: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetColumn) {
      dispatch(updateTask({
        ...task,
        status: targetColumn
      }));
      
      toast({
        title: "Task updated",
        description: `Task moved to ${targetColumn}`,
      });
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setProjectFilter('');
    setAssigneeFilter('');
    setActiveTab('all');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-600">Manage your task list</p>
        </div>
        
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      {/* Task filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-muted' : ''}
          >
            List
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode('kanban')}
            className={viewMode === 'kanban' ? 'bg-muted' : ''}
          >
            Kanban
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} />
            <span>Filter</span>
            <ChevronDown size={14} />
          </Button>
        </div>
      </div>
      
      {/* Extended filters panel */}
      {isFilterOpen && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Assignee</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="mb-1 w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Bulk actions bar */}
      <BulkActions 
        selectedTasks={selectedTasks} 
        clearSelection={() => setSelectedTasks([])} 
      />
      
      {/* Render tasks based on view mode */}
      {viewMode === 'list' ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <Card className="p-0">
              <div className="p-2 border-b border-gray-100 flex items-center">
                <Checkbox 
                  id="select-all" 
                  checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                  onCheckedChange={handleSelectAllTasks}
                  className="ml-2 mr-4"
                />
                <div className="grid grid-cols-12 w-full text-sm font-medium text-gray-500">
                  <div className="col-span-5">Task</div>
                  <div className="col-span-2">Project</div>
                  <div className="col-span-2">Assigned To</div>
                  <div className="col-span-2">Due Date</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredTasks.map((task) => {
                  const assignedUser = getUser(task.assignedTo);
                  const project = getProject(task.projectId);
                  
                  return (
                    <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          id={`task-${task.id}`} 
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={(checked) => handleSelectTask(task.id, !!checked)}
                          className="mt-1"
                        />
                        
                        <div className="grid grid-cols-12 w-full gap-2">
                          <div className="col-span-5">
                            <div className="flex items-start gap-2">
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
                              
                              <div>
                                <h3 className="font-medium text-gray-900">{task.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                                <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
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
                          </div>
                          
                          <div className="col-span-2">
                            <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full inline-flex items-center gap-1">
                              <Briefcase size={12} />
                              {project?.name || 'Unknown Project'}
                            </span>
                          </div>
                          
                          <div className="col-span-2">
                            {assignedUser ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={assignedUser.avatar}
                                  alt={assignedUser.name}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="text-xs font-medium">
                                  {assignedUser.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs">Unassigned</span>
                            )}
                          </div>
                          
                          <div className="col-span-2 flex items-center text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          
                          <div className="col-span-1 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(task.id, 'To Do')}
                                  disabled={task.status === 'To Do'}
                                >
                                  To Do
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(task.id, 'In Progress')}
                                  disabled={task.status === 'In Progress'}
                                >
                                  In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(task.id, 'Completed')}
                                  disabled={task.status === 'Completed'}
                                >
                                  Completed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteRequest(task.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredTasks.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No tasks found</p>
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(columns).map((columnKey) => {
            // Apply filters to each column
            const columnTasks = columns[columnKey as keyof typeof columns].filter(task => {
              let shouldInclude = true;
              
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                shouldInclude = task.title.toLowerCase().includes(query) || 
                                task.description.toLowerCase().includes(query);
              }
              
              if (shouldInclude && projectFilter) {
                shouldInclude = task.projectId === projectFilter;
              }
              
              if (shouldInclude && assigneeFilter) {
                shouldInclude = task.assignedTo === assigneeFilter;
              }
              
              return shouldInclude;
            });
            
            return (
              <div key={columnKey} className="h-full">
                <Card className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-100 font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {columnKey === 'To Do' && <AlertCircle size={16} className="text-gray-500" />}
                      {columnKey === 'In Progress' && <Clock size={16} className="text-blue-500" />}
                      {columnKey === 'Completed' && <CheckCircle2 size={16} className="text-green-500" />}
                      {columnKey}
                    </div>
                    <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {columnTasks.length}
                    </div>
                  </div>
                  
                  <div 
                    className="flex-1 p-2 space-y-2 overflow-y-auto"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const taskId = e.dataTransfer.getData('taskId');
                      handleTaskDrop(taskId, columnKey);
                    }}
                  >
                    {columnTasks.map((task) => {
                      const assignedUser = getUser(task.assignedTo);
                      const project = getProject(task.projectId);
                      
                      return (
                        <div 
                          key={task.id} 
                          className="border rounded-md p-3 bg-white shadow-sm cursor-move"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('taskId', task.id);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteRequest(task.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              task.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : task.priority === 'Medium'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                            
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar size={10} className="mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                            {assignedUser ? (
                              <div className="flex items-center gap-1">
                                <img
                                  src={assignedUser.avatar}
                                  alt={assignedUser.name}
                                  className="w-5 h-5 rounded-full"
                                />
                                <span className="text-xs">
                                  {assignedUser.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs">Unassigned</span>
                            )}
                            
                            {project && (
                              <span className="text-xs bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full">
                                {project.name}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {columnTasks.length === 0 && (
                      <div className="text-center p-4 text-sm text-gray-500 h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-md">
                        <div>
                          <p>No tasks</p>
                          <p className="text-xs">Drag tasks here</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {columnKey === 'To Do' && (
                    <div className="p-2 border-t border-gray-100">
                      <Button 
                        variant="ghost" 
                        className="w-full flex items-center justify-center text-gray-500"
                        onClick={handleCreateTask}
                      >
                        <Plus size={16} className="mr-1" /> Add Task
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Task Modal for Create/Edit */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)}
        task={currentTask}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
