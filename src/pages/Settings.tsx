
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/hooks/reduxHooks';
import withAuth from '@/hooks/withAuth';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Save,
  Shield,
  Camera
} from 'lucide-react';

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().optional(),
});

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Notifications settings schema
const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  taskReminders: z.boolean(),
  projectUpdates: z.boolean(),
  teamMentions: z.boolean(),
});

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [accentColor, setAccentColor] = useState<string>('primary');
  const [language, setLanguage] = useState<string>('en');
  const user = useAppSelector(state => state.auth.user);
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || 'John Doe',
      email: user?.email || 'john@example.com',
      role: user?.role || 'Project Manager',
    },
  });
  
  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  // Notifications form
  const notificationsForm = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      taskReminders: true,
      projectUpdates: true,
      teamMentions: true,
    },
  });
  
  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    // Simulate API call to update profile
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated.",
      });
    }, 500);
  };
  
  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    // Simulate API call to change password
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    }, 500);
  };
  
  const onNotificationsSubmit = (values: z.infer<typeof notificationsSchema>) => {
    // Simulate API call to update notification preferences
    setTimeout(() => {
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    }, 500);
  };
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setActiveTheme(theme);
    // Here you would implement actual theme change logic
    // For example, setting a class on the body element or using a theme provider
    toast({
      title: "Theme Changed",
      description: `Theme set to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    });
  };
  
  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    toast({
      title: "Accent Color Changed",
      description: "Your accent color preference has been updated.",
    });
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    toast({
      title: "Language Changed",
      description: "Your language preference has been updated.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette size={16} />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe size={16} />
            <span className="hidden sm:inline">Language</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
            
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                  <div className="relative">
                    <img
                      src={user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border border-gray-200"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      title="Change Profile Picture"
                    >
                      <Camera size={14} />
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input readOnly {...field} />
                          </FormControl>
                          <FormDescription>
                            Your role determines what you can access in the system.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Bio</h3>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Write a short bio about yourself..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Security Settings</h2>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Enhance your account security by enabling 2FA</p>
                      <p className="text-sm text-gray-500 mt-1">We'll send a verification code to your email</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => passwordForm.reset()}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
            
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={notificationsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive emails about important updates and changes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="taskReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Task Reminders</FormLabel>
                          <FormDescription>
                            Get reminded about upcoming deadlines
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="projectUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Project Updates</FormLabel>
                          <FormDescription>
                            Be notified when project status changes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="teamMentions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Team Mentions</FormLabel>
                          <FormDescription>
                            Get notified when you're mentioned in comments or tasks
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => notificationsForm.reset()}>
                    Reset
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className={`p-4 relative border-2 ${activeTheme === 'light' ? 'border-primary-500' : 'border-transparent'} cursor-pointer`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="aspect-video bg-white rounded-md mb-2 border border-gray-200"></div>
                    <p className="font-medium text-center">Light</p>
                    {activeTheme === 'light' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full"></div>
                    )}
                  </Card>
                  
                  <Card 
                    className={`p-4 relative border-2 ${activeTheme === 'dark' ? 'border-primary-500' : 'border-transparent'} cursor-pointer`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="aspect-video bg-gray-800 rounded-md mb-2"></div>
                    <p className="font-medium text-center">Dark</p>
                    {activeTheme === 'dark' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full"></div>
                    )}
                  </Card>
                  
                  <Card 
                    className={`p-4 relative border-2 ${activeTheme === 'system' ? 'border-primary-500' : 'border-transparent'} cursor-pointer`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <div className="aspect-video bg-gradient-to-r from-white to-gray-800 rounded-md mb-2"></div>
                    <p className="font-medium text-center">System</p>
                    {activeTheme === 'system' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full"></div>
                    )}
                  </Card>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Accent Color</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'primary', color: 'bg-primary-500' },
                    { name: 'purple', color: 'bg-purple-500' },
                    { name: 'pink', color: 'bg-pink-500' },
                    { name: 'orange', color: 'bg-orange-500' },
                    { name: 'green', color: 'bg-green-500' }
                  ].map(({ name, color }) => (
                    <div 
                      key={name}
                      className={`w-8 h-8 rounded-full ${color} cursor-pointer ${accentColor === name ? 'ring-2 ring-primary-200 ring-offset-2' : ''}`}
                      onClick={() => handleAccentColorChange(name)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Language Settings</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Language
                </Label>
                <select 
                  id="language-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="en">English (US)</option>
                  <option value="en-gb">English (UK)</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default withAuth(Settings);
