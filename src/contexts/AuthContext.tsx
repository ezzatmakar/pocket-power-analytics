
import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define AuthUser type
type AuthUser = {
  id: string;
  email: string;
  name: string;
} | null;

// Define AuthContext type
type AuthContextType = {
  user: AuthUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if we have a stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('moneyTrackerUser');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('moneyTrackerUser');
      }
    }
    
    setIsLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call for now
      // This will be replaced with Supabase authentication later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@example.com' && password === 'password') {
        const userData = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User'
        };
        
        setUser(userData);
        localStorage.setItem('moneyTrackerUser', JSON.stringify(userData));
        toast({
          title: "Login Successful",
          description: "Welcome back to Money Tracker!",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your email and password and try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      const userData = {
        id: Date.now().toString(),
        email,
        name
      };
      
      setUser(userData);
      localStorage.setItem('moneyTrackerUser', JSON.stringify(userData));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please try again with a different email address.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('moneyTrackerUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
