
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) return;
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in AuthContext
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-money-bg">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-money-primary flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Money Tracker</CardTitle>
          <CardDescription className="text-center">Log in to your account to track your income</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
            <div className="text-center text-sm mt-4 text-slate-500">
              <span>Demo credentials are prefilled for you.</span>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground mx-auto">
            Don't have an account?{" "}
            <Link to="/register" className="text-money-primary hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
