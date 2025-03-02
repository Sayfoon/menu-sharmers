
import { Link } from 'react-router-dom';

const NavbarLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center hover:opacity-80 transition-opacity"
    >
      <img 
        src="/lovable-uploads/e89218ce-4e43-4e91-ba9e-80dfa195d803.png" 
        alt="Sharmers Menus" 
        className="h-10 max-w-full"
      />
    </Link>
  );
};

export default NavbarLogo;
