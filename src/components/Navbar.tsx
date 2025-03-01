
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logout } from '@/lib/data';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        <Link 
          to="/" 
          className="font-display font-semibold text-lg md:text-xl tracking-tight text-terracotta-600 animate-fade-in hover:opacity-80 transition-opacity"
        >
          Feast
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {currentUser ? (
            <>
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/dashboard' 
                    ? 'text-terracotta-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400'
                } transition-colors duration-200`}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/profile' 
                    ? 'text-terracotta-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400'
                } transition-colors duration-200`}
              >
                Restaurant Profile
              </Link>
              <Link 
                to="/sections" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/sections' 
                    ? 'text-terracotta-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400'
                } transition-colors duration-200`}
              >
                Menu Sections
              </Link>
              <Link 
                to="/preview" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/preview' 
                    ? 'text-terracotta-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400'
                } transition-colors duration-200`}
              >
                Preview
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="ml-2 text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/login' 
                    ? 'text-terracotta-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400'
                } transition-colors duration-200`}
              >
                Login
              </Link>
              <Link to="/register">
                <Button 
                  variant="default" 
                  className="ml-2 bg-terracotta-600 hover:bg-terracotta-700"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Button */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-panel animate-slide-in-right p-4">
          <div className="flex flex-col space-y-3">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'text-terracotta-600' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/profile' 
                      ? 'text-terracotta-600' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurant Profile
                </Link>
                <Link 
                  to="/sections" 
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/sections' 
                      ? 'text-terracotta-600' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Menu Sections
                </Link>
                <Link 
                  to="/preview" 
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/preview' 
                      ? 'text-terracotta-600' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Preview
                </Link>
                <button 
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 text-left"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/login' 
                      ? 'text-terracotta-600' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="w-full" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    variant="default" 
                    className="w-full bg-terracotta-600 hover:bg-terracotta-700"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
