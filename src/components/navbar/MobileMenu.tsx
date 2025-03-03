
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { NavLinks } from './NavLinks';
import { AuthLinks } from './AuthLinks';

interface MobileMenuProps {
  isOpen: boolean;
  currentUser: User | null;
  onLogout: () => Promise<void>;
  onClose: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  currentUser, 
  onLogout, 
  onClose 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden glass-panel animate-slide-in-right p-4">
      <div className="flex flex-col space-y-3">
        <NavLinks 
          currentUser={currentUser} 
          onLogout={onLogout} 
          isMobile={true}
          onLinkClick={onClose}
        />
        
        <AuthLinks
          currentUser={currentUser}
          onLogout={onLogout}
          isMobile={true}
          onLinkClick={onClose}
        />
        
        {!currentUser && (
          <Link 
            to="/register"
            className="w-full" 
            onClick={onClose}
          >
            <Button 
              variant="default" 
              className="w-full bg-terracotta-600 hover:bg-terracotta-700"
            >
              Register
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
