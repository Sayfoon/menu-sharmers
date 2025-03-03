
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { NavLinks } from './NavLinks';

interface DesktopNavProps {
  currentUser: User | null;
  onLogout: () => Promise<void>;
}

export const DesktopNav = ({ currentUser, onLogout }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavLinks currentUser={currentUser} onLogout={onLogout} />
      
      {currentUser ? (
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="ml-2 text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400"
        >
          Logout
        </Button>
      ) : (
        <Link to="/register">
          <Button 
            variant="default" 
            className="ml-2 bg-terracotta-600 hover:bg-terracotta-700"
          >
            Register
          </Button>
        </Link>
      )}
    </div>
  );
};
