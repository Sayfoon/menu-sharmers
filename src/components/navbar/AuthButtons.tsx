
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { logout } from '@/lib/user';

interface AuthButtonsProps {
  currentUser: User | null;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const AuthButtons = ({ currentUser, isMobile = false, onItemClick = () => {} }: AuthButtonsProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    if (onItemClick) onItemClick();
  };

  if (!currentUser) {
    return (
      <>
        <Link 
          to="/login" 
          className={`${isMobile ? "w-full block mb-2" : ""}`}
          onClick={onItemClick}
        >
          <Button 
            variant="outline" 
            className={`${isMobile ? "w-full" : ""} border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`}
          >
            Login
          </Button>
        </Link>

        <Link 
          to="/register" 
          className={`${isMobile ? "w-full block" : ""}`}
          onClick={onItemClick}
        >
          <Button 
            variant="default" 
            className={`${isMobile ? "w-full" : "ml-2"} bg-brand-orange hover:bg-brand-orange/90`}
          >
            Register
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      {isMobile ? (
        <button 
          className="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 text-left w-full hover:text-brand-orange dark:hover:text-brand-orange"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="ml-2 text-gray-700 dark:text-gray-300 hover:text-brand-orange dark:hover:text-brand-orange"
        >
          Logout
        </Button>
      )}
    </>
  );
};

export default AuthButtons;
