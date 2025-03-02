
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  // Check if user is already logged in
  useEffect(() => {
    let mounted = true;
    
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user && mounted) {
          console.log('Active user session found:', user);
          navigate('/dashboard');
        } else if (mounted) {
          console.log('No active session found, staying on login page');
          setIsCheckingSession(false);
        }
      } catch (err) {
        console.error('Error checking current user:', err);
        if (mounted) {
          setIsCheckingSession(false);
        }
      }
    };
    
    // Set a timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      if (mounted && isCheckingSession) {
        console.log('Session check timeout - forcing completion');
        setIsCheckingSession(false);
      }
    }, 2000); // 2 second timeout as failsafe
    
    checkUser();
    
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      console.log('Attempting login with:', email);
      const user = await login(email, password);
      
      if (user) {
        console.log('Login successful, user:', user);
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      } else {
        console.error('Login failed: no user returned');
        setError('Invalid email or password. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Show more specific error message if available
      if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('An error occurred during login. Please check your credentials and try again.');
      }
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Checking authentication status...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
              <p className="text-gray-600 dark:text-gray-400">Sign in to manage your restaurant menu</p>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-6 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="#" 
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign up
                </Link>
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
