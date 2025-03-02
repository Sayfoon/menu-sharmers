
import { User } from '@/types';
import NavMenu from './NavMenu';
import AuthButtons from './AuthButtons';

interface DesktopMenuProps {
  currentUser: User | null;
}

const DesktopMenu = ({ currentUser }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavMenu currentUser={currentUser} />
      <AuthButtons currentUser={currentUser} />
    </div>
  );
};

export default DesktopMenu;
