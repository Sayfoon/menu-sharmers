
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
        {!isMobile && (
          <Link to="/register" onClick={onItemClick}>
            <Button 
              variant="default" 
              className={`${isMobile ? "w-full " : "ml-2 "}bg-terracotta-600 hover:bg-terracotta-700`}
            >
              Register
            </Button>
          </Link>
        )}
        {isMobile && (
          <Link 
            to="/register"
            className="w-full" 
            onClick={onItemClick}
          >
            <Button 
              variant="default" 
              className="w-full bg-terracotta-600 hover:bg-terracotta-700"
            >
              Register
            </Button>
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      {isMobile ? (
        <button 
          className="px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 text-left"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </button>
      ) : (
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="ml-2 text-gray-700 dark:text-gray-300 hover:text-terracotta-600 dark:hover:text-terracotta-400"
        >
          Logout
        </Button>
      )}
    </>
  );
};

export default AuthButtons;
