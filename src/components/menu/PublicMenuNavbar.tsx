
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types';

interface PublicMenuNavbarProps {
  restaurant: Restaurant | null;
}

const PublicMenuNavbar: React.FC<PublicMenuNavbarProps> = ({ restaurant }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Home size={18} />
            </Button>
          </Link>
          {restaurant && (
            <span className="text-sm font-medium truncate">
              {restaurant.name}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicMenuNavbar;
