
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { register } from '@/lib/user';
import { RegisterFormData } from '@/types';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate agreement to terms
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process');
      // Register user - Detailed logging
      console.log('Attempting registration for:', formData.email);
      
      const user = await register(formData.name, formData.email, formData.password);
      console.log('Registration response:', user);
      
      if (user) {
        toast({
          title: "Account created",
          description: "Your account has been successfully created.",
        });
        console.log('Registration successful, redirecting to dashboard');
        
        // Force a small delay to ensure state updates before navigation
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Increased delay to ensure proper registration completion
      } else {
        setError('Registration failed. Please try again.');
        console.error('Registration failed: No user returned');
      }
    } catch (error: any) {
      console.error('Registration error details:', error);
      // Handle specific Supabase error messages
      if (error.message) {
        if (error.message.includes('already registered')) {
          setError('This email is already registered. Please use a different email or login.');
        } else {
          setError(`Registration error: ${error.message}`);
        }
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create an account</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign up to start managing your restaurant menu</p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agreeToTerms" 
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
              }
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="agreeToTerms" className="text-sm font-normal">
              I agree to the{' '}
              <Link to="#" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
