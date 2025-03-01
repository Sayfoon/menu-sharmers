
import React from 'react';
import { Restaurant } from '@/types';

interface MenuHeaderProps {
  restaurant: Restaurant;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ restaurant }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        {restaurant.logo && (
          <img 
            src={restaurant.logo} 
            alt={`${restaurant.name} logo`} 
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {restaurant.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
        <span>{restaurant.address}</span>
        <span>{restaurant.phone}</span>
        {restaurant.website && <span>{restaurant.website}</span>}
      </div>
    </div>
  );
};

export default MenuHeader;
