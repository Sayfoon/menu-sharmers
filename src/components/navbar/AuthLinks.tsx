
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface AuthLinksProps {
  currentUser: User | null;
  onLogout: () => Promise<void>;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export const AuthLinks = ({ 
  currentUser, 
  onLogout, 
  isMobile = false,
  onLinkClick = () => {}
}: AuthLinksProps) => {
  return (
    <>
      {currentUser ? (
        isMobile ? (
          <button 
            className="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 text-left"
            onClick={() => {
              onLogout();
              onLinkClick();
            }}
          >
            Logout
          </button>
        ) : (
          <Button 
            variant="ghost" 
            onClick={onLogout}
            className="ml-2 text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400"
          >
            Logout
          </Button>
        )
      ) : (
        <Link 
          to="/login" 
          className={`${isMobile ? 'px-3 py-2 rounded-md text-base' : 'px-3 py-2 rounded-md text-sm'} font-medium text-gray-700 dark:text-gray-300 ${!isMobile ? 'hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors duration-200' : ''}`}
          onClick={onLinkClick}
        >
          Login
        </Link>
      )}
    </>
  );
};
