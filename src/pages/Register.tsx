
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/auth/RegisterForm';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log('User already logged in, redirecting to dashboard');
        navigate('/dashboard');
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, redirecting to dashboard');
        setTimeout(() => navigate('/dashboard'), 500);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <RegisterForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
