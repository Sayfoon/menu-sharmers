
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getCurrentUser } from '@/lib/user';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import NavbarLogo from './navbar/NavbarLogo';
import DesktopMenu from './navbar/DesktopMenu';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the current user when the component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NavbarLogo />

        {/* Desktop Navigation */}
        <DesktopMenu currentUser={currentUser} />

        {/* Mobile Navigation Button */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        currentUser={currentUser}
        onItemClick={() => setIsMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
