
import { Link, useLocation } from 'react-router-dom';
import { User } from '@/types';

interface NavMenuProps {
  currentUser: User | null;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavMenu = ({ currentUser, isMobile = false, onItemClick = () => {} }: NavMenuProps) => {
  const location = useLocation();
  
  const linkClasses = (path: string) => {
    const isActive = location.pathname === path;
    const baseClasses = isMobile 
      ? "px-3 py-2 rounded-md text-base font-medium block w-full text-left" 
      : "px-3 py-2 rounded-md text-sm font-medium";
      
    return `${baseClasses} ${
      isActive 
        ? 'text-brand-orange font-semibold' 
        : 'text-gray-700 dark:text-gray-300 hover:text-brand-orange dark:hover:text-brand-orange'
    } transition-colors duration-200`;
  };

  // We don't need to show navigation items for unauthenticated users
  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Link 
        to="/dashboard" 
        className={linkClasses('/dashboard')}
        onClick={onItemClick}
      >
        Dashboard
      </Link>
      <Link 
        to="/menu" 
        className={linkClasses('/menu')}
        onClick={onItemClick}
      >
        Menu
      </Link>
      <Link 
        to="/sections" 
        className={linkClasses('/sections')}
        onClick={onItemClick}
      >
        Sections
      </Link>
      <Link 
        to="/profile" 
        className={linkClasses('/profile')}
        onClick={onItemClick}
      >
        Profile
      </Link>
    </>
  );
};

export default NavMenu;
