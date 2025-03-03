
import { Link, useLocation } from 'react-router-dom';
import { User } from '@/types';

interface NavLinksProps {
  currentUser: User | null;
  onLogout: () => Promise<void>;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export const NavLinks = ({ 
  currentUser, 
  onLogout, 
  isMobile = false,
  onLinkClick = () => {}
}: NavLinksProps) => {
  const location = useLocation();
  
  const linkClasses = (path: string) => {
    const isActive = location.pathname === path;
    
    return `${isMobile ? 'px-3 py-2 rounded-md text-base' : 'px-3 py-2 rounded-md text-sm'} font-medium ${
      isActive 
        ? 'text-terracotta-600' 
        : `text-gray-700 dark:text-gray-300 ${!isMobile ? 'hover:text-terracotta-600 dark:hover:text-terracotta-400' : ''}`
    } ${!isMobile ? 'transition-colors duration-200' : ''}`;
  };

  return (
    <>
      {currentUser ? (
        <>
          <Link 
            to="/dashboard" 
            className={linkClasses('/dashboard')}
            onClick={onLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/profile" 
            className={linkClasses('/profile')}
            onClick={onLinkClick}
          >
            Restaurant Profile
          </Link>
          <Link 
            to="/sections" 
            className={linkClasses('/sections')}
            onClick={onLinkClick}
          >
            Menu Sections
          </Link>
          <Link 
            to="/menu" 
            className={linkClasses('/menu')}
            onClick={onLinkClick}
          >
            Menu
          </Link>
        </>
      ) : null}
    </>
  );
};
