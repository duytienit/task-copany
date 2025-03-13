
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, User, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { updateTask, deleteTask } from '@/features/tasks/tasksSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsProps {
  selectedTasks: string[];
  clearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedTasks, clearSelection }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { users } = useAppSelector((state) => state.users);
  const { tasks } = useAppSelector((state) => state.tasks);
  
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleMarkAsCompleted = () => {
    const selectedTasksData = tasks.filter(task => selectedTasks.includes(task.id));
    
    selectedTasksData.forEach(task => {
      dispatch(updateTask({
        ...task,
        status: 'Completed'
      }));
    });
    
    toast({
      title: "Tasks updated",
      description: `${selectedTasks.length} tasks marked as completed`,
    });
    
    clearSelection();
  };
  
  const handleAssignTasks = () => {
    if (!selectedUser) return;
    
    const selectedTasksData = tasks.filter(task => selectedTasks.includes(task.id));
    
    selectedTasksData.forEach(task => {
      dispatch(updateTask({
        ...task,
        assignedTo: selectedUser
      }));
    });
    
    const assignedUser = users.find(user => user.id === selectedUser);
    
    toast({
      title: "Tasks assigned",
      description: `${selectedTasks.length} tasks assigned to ${assignedUser?.name}`,
    });
    
    setAssignDialogOpen(false);
    setSelectedUser('');
    clearSelection();
  };
  
  const handleDeleteTasks = () => {
    selectedTasks.forEach(taskId => {
      dispatch(deleteTask(taskId));
    });
    
    toast({
      title: "Tasks deleted",
      description: `${selectedTasks.length} tasks have been deleted`,
      variant: "destructive",
    });
    
    setDeleteDialogOpen(false);
    clearSelection();
  };
  
  if (selectedTasks.length === 0) return null;
  
  return (
    <div className="bg-white border rounded-md shadow-sm p-3 mb-4 flex items-center justify-between">
      <div>
        <span className="font-medium">{selectedTasks.length} task(s) selected</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAssignDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <User size={16} /> Assign
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleMarkAsCompleted}
          className="flex items-center gap-1"
        >
          <CheckSquare size={16} /> Mark Complete
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setDeleteDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Trash2 size={16} /> Delete
        </Button>
      </div>
      
      {/* Assign Tasks Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Tasks</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Select User
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="" disabled>Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTasks} disabled={!selectedUser}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Tasks Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tasks</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete {selectedTasks.length} tasks? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTasks}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkActions;
