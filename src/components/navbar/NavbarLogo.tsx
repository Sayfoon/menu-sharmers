
import { Link } from 'react-router-dom';

interface NavbarLogoProps {
  logoUrl: string;
  altText: string;
}

export const NavbarLogo = ({ logoUrl, altText }: NavbarLogoProps) => {
  return (
    <Link 
      to="/" 
      className="flex items-center hover:opacity-80 transition-opacity"
    >
      <img 
        src={logoUrl} 
        alt={altText} 
        className="h-12"
      />
    </Link>
  );
};
