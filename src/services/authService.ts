
import mockData from '@/data/mock-data.json';

// Generate a simple JWT-like token
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
  const signature = btoa(`${Math.random().toString(36).slice(2)}`);
  
  return `${header}.${payload}.${signature}`;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user by email (case insensitive)
  const user = mockData.users.find(
    user => user.email.toLowerCase() === credentials.email.toLowerCase()
  );
  
  // In a real app, we would check the password hash
  // For this mock version, we'll just check if the password exists
  if (user && credentials.password) {
    const token = generateToken(user.id);
    return {
      success: true,
      user,
      token
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password'
  };
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if email already exists
  const existingUser = mockData.users.find(
    user => user.email.toLowerCase() === data.email.toLowerCase()
  );
  
  if (existingUser) {
    return {
      success: false,
      error: 'Email already in use'
    };
  }
  
  // Create new user (in a real app, this would save to DB)
  const newUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    // Default to Employee role for new registrations
    role: 'Employee',
    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
  };
  
  const token = generateToken(newUser.id);
  
  return {
    success: true,
    user: newUser,
    token
  };
};

export const validateUserRole = (requiredRoles: string[], userRole?: string): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};
