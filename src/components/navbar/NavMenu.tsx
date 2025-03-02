
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
      ? "px-3 py-2 rounded-md text-base font-medium" 
      : "px-3 py-2 rounded-md text-sm font-medium";
      
    return `${baseClasses} ${
      isActive 
        ? 'text-terracotta-600' 
        : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400'
    } transition-colors duration-200`;
  };

  if (!currentUser) {
    return (
      <>
        <Link 
          to="/login" 
          className={linkClasses('/login')}
          onClick={onItemClick}
        >
          Login
        </Link>
      </>
    );
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
        to="/profile" 
        className={linkClasses('/profile')}
        onClick={onItemClick}
      >
        Restaurant Profile
      </Link>
      <Link 
        to="/sections" 
        className={linkClasses('/sections')}
        onClick={onItemClick}
      >
        Menu Sections
      </Link>
      <Link 
        to="/preview" 
        className={linkClasses('/preview')}
        onClick={onItemClick}
      >
        Preview
      </Link>
    </>
  );
};

export default NavMenu;
