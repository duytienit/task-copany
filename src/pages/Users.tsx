
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure, selectUser } from '@/features/users/usersSlice';
import mockData from '@/data/mock-data.json';
import withAuth from '@/hooks/withAuth';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Plus, 
  Search, 
  Filter,
  Mail,
  MoreHorizontal,
  UserPlus,
  CheckCircle,
  Edit,
  Trash
} from 'lucide-react';

// Form validation schema
const inviteUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
});

const roles = ["Admin", "Project Manager", "Employee"];

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  
  // Initialize the form
  const form = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Employee",
    },
  });
  
  useEffect(() => {
    // Simulating API call to fetch users
    dispatch(fetchUsersStart());
    try {
      dispatch(fetchUsersSuccess(mockData.users));
    } catch (error) {
      dispatch(fetchUsersFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [dispatch]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
  };
  
  const handleInviteUser = (values: z.infer<typeof inviteUserSchema>) => {
    // Simulate API call to invite a user
    const newUser = {
      id: `user-${Date.now()}`,
      name: values.name,
      email: values.email,
      role: values.role,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
    };
    
    // Update the Redux store
    dispatch(fetchUsersSuccess([...users, newUser]));
    
    // Close dialog and show success message
    setShowInviteDialog(false);
    form.reset();
    
    toast({
      title: "Invitation Sent",
      description: `${values.name} has been invited as ${values.role}.`,
    });
  };
  
  const handleChangeRole = (userId: string, newRole: string) => {
    // Simulate API call to update user role
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    
    dispatch(fetchUsersSuccess(updatedUsers));
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`,
    });
  };
  
  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
          <p className="text-gray-600">Manage your organization's users and permissions</p>
        </div>
        
        <Button onClick={() => setShowInviteDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Invite User
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-60">
          <Select value={roleFilter} onValueChange={handleRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-8 flex justify-center">
            <p>Loading users...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="h-20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={user.role} onValueChange={(value) => handleChangeRole(user.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" title="Edit User">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete User">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      
      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new team member.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInviteUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrap component with auth HOC to check for Admin role
export default withAuth(UsersPage, { requiredRoles: ['Admin', 'Manager'] });
