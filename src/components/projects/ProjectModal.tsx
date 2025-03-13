
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { addProject, updateProject } from '@/features/projects/projectsSlice';
import { Checkbox } from '@/components/ui/checkbox';

// Define form schema with validation
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string(),
  deadline: z.string(),
  teamMembers: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: any; // Use the existing project for editing mode
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const isEditMode = !!project;

  // Set up form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: isEditMode
      ? {
          name: project.name,
          description: project.description,
          status: project.status,
          deadline: project.deadline,
          teamMembers: project.teamMembers,
        }
      : {
          name: '',
          description: '',
          status: 'Planning',
          deadline: new Date().toISOString().split('T')[0],
          teamMembers: [],
        },
  });

  const handleSubmit = (values: ProjectFormValues) => {
    // Ensure all required properties are present for type safety
    if (isEditMode) {
      dispatch(
        updateProject({
          id: project.id,
          name: values.name,
          description: values.description,
          status: values.status,
          progress: project.progress,
          deadline: values.deadline,
          teamMembers: values.teamMembers || [],
        })
      );
    } else {
      dispatch(
        addProject({
          id: `project-${Date.now()}`,
          name: values.name,
          description: values.description,
          status: values.status,
          progress: 0,
          deadline: values.deadline,
          teamMembers: values.teamMembers || [],
        })
      );
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the project details below.'
              : 'Fill in the information below to create a new project.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2"
                        {...field}
                      >
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Team Members</FormLabel>
              <div className="border rounded-md p-4 space-y-2 mt-1">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.id}
                      checked={form.getValues().teamMembers?.includes(user.id)}
                      onCheckedChange={(checked) => {
                        const currentTeam = form.getValues().teamMembers || [];
                        const newTeam = checked
                          ? [...currentTeam, user.id]
                          : currentTeam.filter((id) => id !== user.id);
                        form.setValue('teamMembers', newTeam);
                      }}
                    />
                    <label htmlFor={user.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                      {user.name} - {user.role}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? 'Update Project' : 'Create Project'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
