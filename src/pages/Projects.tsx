
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchProjectsSuccess, deleteProject } from '@/features/projects/projectsSlice';
import { fetchUsersSuccess } from '@/features/users/usersSlice';
import mockData from '@/data/mock-data.json';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  Filter,
  FolderKanban,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  Briefcase
} from 'lucide-react';
import ProjectModal from '@/components/projects/ProjectModal';
import { useToast } from '@/hooks/use-toast';

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { users } = useAppSelector((state) => state.users);
  const { toast } = useToast();
  
  // State for UI controls
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'deadline' | 'progress'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // State for modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [projectToView, setProjectToView] = useState<any>(null);
  
  useEffect(() => {
    dispatch(fetchProjectsSuccess(mockData.projects));
    dispatch(fetchUsersSuccess(mockData.users));
  }, [dispatch]);
  
  // Get team members data
  const getTeamMembers = (memberIds: string[]) => {
    return memberIds.map(id => users.find(user => user.id === id)).filter(Boolean);
  };
  
  // Filter and sort projects
  const getFilteredProjects = () => {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project => 
          project.name.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'deadline') {
        return sortOrder === 'asc' 
          ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else if (sortBy === 'progress') {
        return sortOrder === 'asc' 
          ? a.progress - b.progress
          : b.progress - a.progress;
      }
      return 0;
    });
    
    return filtered;
  };
  
  const filteredProjects = getFilteredProjects();
  
  // Handler functions
  const handleCreateProject = () => {
    setCurrentProject(null);
    setIsProjectModalOpen(true);
  };
  
  const handleEditProject = (project: any) => {
    setCurrentProject(project);
    setIsProjectModalOpen(true);
  };
  
  const handleViewProject = (project: any) => {
    setProjectToView(project);
    setIsViewModalOpen(true);
  };
  
  const handleDeleteRequest = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      dispatch(deleteProject(projectToDelete));
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-600">Manage your project portfolio</p>
        </div>
        
        <Button className="bg-primary-500 hover:bg-primary-600" onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-muted' : ''}
          >
            <FolderKanban size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-muted' : ''}
          >
            <Briefcase size={16} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Filter size={16} />
                <span className="ml-1">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSortBy('name'); toggleSortOrder(); }}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('deadline'); toggleSortOrder(); }}>
                Deadline {sortBy === 'deadline' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('progress'); toggleSortOrder(); }}>
                Progress {sortBy === 'progress' && (sortOrder === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProject(project)}>
                        <Eye className="mr-2 h-4 w-4" /> View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditProject(project)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteRequest(project.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  <div className="text-sm text-gray-600 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(project.deadline).toLocaleDateString()}
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
                    <Button variant="ghost" size="sm" className="text-primary-500" onClick={() => handleViewProject(project)}>
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          <Card className="border-dashed border-2 border-gray-300 bg-transparent flex items-center justify-center">
            <Button variant="ghost" className="text-gray-500 hover:text-primary-500" onClick={handleCreateProject}>
              <Plus className="mr-2 h-5 w-5" />
              <span>Add New Project</span>
            </Button>
          </Card>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="w-[100px]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(project.deadline).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {getTeamMembers(project.teamMembers).slice(0, 3).map((user: any) => (
                        <img
                          key={user.id}
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full border-2 border-white"
                          title={user.name}
                        />
                      ))}
                      {project.teamMembers.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProject(project)}>
                          <Eye className="mr-2 h-4 w-4" /> View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProject(project)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteRequest(project.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      
      {/* Project Modal for Create/Edit */}
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)}
        project={currentProject}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this project? This action cannot be undone and will remove all associated tasks.</p>
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
      
      {/* View Project Details */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{projectToView?.name}</DialogTitle>
          </DialogHeader>
          {projectToView && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Description</h4>
                <p className="text-sm text-gray-600">{projectToView.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Status</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    projectToView.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : projectToView.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {projectToView.status}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">Deadline</h4>
                  <p className="text-sm text-gray-600">{new Date(projectToView.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-1">Progress</h4>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{projectToView.progress}%</span>
                </div>
                <Progress value={projectToView.progress} className="h-2" />
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  <Users size={16} className="mr-1" /> Team Members
                </h4>
                <div className="space-y-2">
                  {getTeamMembers(projectToView.teamMembers).map((user: any) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewModalOpen(false);
              handleEditProject(projectToView);
            }}>
              Edit Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
