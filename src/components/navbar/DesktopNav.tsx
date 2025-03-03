
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { NavLinks } from './NavLinks';
import { AuthLinks } from './AuthLinks';

interface DesktopNavProps {
  currentUser: User | null;
  onLogout: () => Promise<void>;
}

export const DesktopNav = ({ currentUser, onLogout }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavLinks currentUser={currentUser} onLogout={onLogout} />
      
      {!currentUser ? (
        <Link to="/register">
          <Button 
            variant="default" 
            className="ml-2 bg-terracotta-600 hover:bg-terracotta-700"
          >
            Register
          </Button>
        </Link>
      ) : null}
      
      <AuthLinks currentUser={currentUser} onLogout={onLogout} />
    </div>
  );
};
