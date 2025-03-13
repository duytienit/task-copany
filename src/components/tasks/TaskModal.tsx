
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { addTask, updateTask } from '@/features/tasks/tasksSlice';

// Define form schema with validation
const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string(),
  priority: z.string(),
  projectId: z.string().min(1, 'Project is required'),
  assignedTo: z.string().min(1, 'Assignee is required'),
  dueDate: z.string(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any; // Use the existing task for editing mode
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);
  const isEditMode = !!task;
  const currentUser = useAppSelector((state) => state.auth.user);

  // Set up form with default values
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: isEditMode
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          projectId: task.projectId,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
        }
      : {
          title: '',
          description: '',
          status: 'To Do',
          priority: 'Medium',
          projectId: '',
          assignedTo: '',
          dueDate: new Date().toISOString().split('T')[0],
        },
  });

  const handleSubmit = (values: TaskFormValues) => {
    if (isEditMode) {
      dispatch(
        updateTask({
          id: task.id,
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          projectId: values.projectId,
          assignedTo: values.assignedTo,
          dueDate: values.dueDate,
          createdBy: task.createdBy,
        })
      );
    } else {
      dispatch(
        addTask({
          id: `task-${Date.now()}`,
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          projectId: values.projectId,
          assignedTo: values.assignedTo,
          dueDate: values.dueDate,
          createdBy: currentUser?.id || 'user-1', // Default to first user if not authenticated
        })
      );
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the task details below.'
              : 'Fill in the information below to create a new task.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
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
                    <Input placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2"
                        {...field}
                      >
                        <option value="" disabled>Select a project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2"
                        {...field}
                      >
                        <option value="" disabled>Select a user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <option value="To Do">To Do</option>
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2"
                        {...field}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? 'Update Task' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
