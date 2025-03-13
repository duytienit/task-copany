
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchProjectsSuccess } from '@/features/projects/projectsSlice';
import mockData from '@/data/mock-data.json';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter,
  FolderKanban
} from 'lucide-react';

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { users } = useAppSelector((state) => state.users);
  
  useEffect(() => {
    dispatch(fetchProjectsSuccess(mockData.projects));
  }, [dispatch]);
  
  const getTeamMembers = (memberIds: string[]) => {
    return memberIds.map(id => users.find(user => user.id === id)).filter(Boolean);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-600">Manage your project portfolio</p>
        </div>
        
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          <span>Filter</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="bg-primary-100 p-2 rounded-full">
                  <FolderKanban className="text-primary-500" size={20} />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5 mt-1" />
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Due: {new Date(project.deadline).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {getTeamMembers(project.teamMembers).slice(0, 3).map((user: any) => (
                      <img
                        key={user.id}
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary-500">
                    View
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <Card className="border-dashed border-2 border-gray-300 bg-transparent flex items-center justify-center">
          <Button variant="ghost" className="text-gray-500 hover:text-primary-500">
            <Plus className="mr-2 h-5 w-5" />
            <span>Add New Project</span>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
