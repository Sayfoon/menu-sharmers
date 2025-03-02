
import { User } from '@/types';
import NavMenu from './NavMenu';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  currentUser: User | null;
  onItemClick: () => void;
}

const MobileMenu = ({ isOpen, currentUser, onItemClick }: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden glass-panel animate-slide-in-right p-4">
      <div className="flex flex-col space-y-3">
        <NavMenu 
          currentUser={currentUser} 
          isMobile={true} 
          onItemClick={onItemClick} 
        />
        <AuthButtons 
          currentUser={currentUser} 
          isMobile={true} 
          onItemClick={onItemClick} 
        />
      </div>
    </div>
  );
};

export default MobileMenu;
