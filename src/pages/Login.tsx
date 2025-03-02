
import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { login, getCurrentUser } from '@/lib/user';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        console.log("Checking if user is already authenticated...");
        const user = await getCurrentUser();
        
        if (user) {
          console.log("User already logged in, redirecting to dashboard");
          navigate('/dashboard');
        } else {
          console.log("No user logged in, showing login form");
        }
      } catch (err) {
        console.error("Error checking auth:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting login form with:", email);
    setError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }
    
    try {
      const user = await login(email, password);
      
      if (user) {
        console.log("Login successful, user:", user);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Add a delay before navigation to ensure session is properly stored
        setTimeout(() => {
          console.log("Navigating to dashboard");
          navigate('/dashboard');
        }, 1000);
      } else {
        console.error("Login returned null user");
        setError('Invalid email or password');
      }
    } catch (error: any) {
      console.error('Login error in component:', error);
      setError(error.message || 'Failed to login');
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-terracotta-600 hover:text-terracotta-800">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-terracotta-600 hover:bg-terracotta-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-terracotta-600 hover:text-terracotta-800 font-medium">
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
