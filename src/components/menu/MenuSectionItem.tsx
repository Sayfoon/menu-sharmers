
import React from 'react';
import { MenuItem } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface MenuSectionItemProps {
  item: MenuItem;
  formatPrice: (price: number) => string;
}

const MenuSectionItem: React.FC<MenuSectionItemProps> = ({ item, formatPrice }) => {
  return (
    <Card key={item.id} className="overflow-hidden">
      {item.image && (
        <div className="h-40 w-full">
          <div 
            className="h-full w-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${item.image})` }}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="mr-2">{item.name}</CardTitle>
          <div className="font-bold text-lg">{formatPrice(item.price)}</div>
        </div>
        <CardDescription className="mt-1">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {item.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.dietary.map(option => (
              <span 
                key={option} 
                className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
              >
                {option}
              </span>
            ))}
          </div>
        )}
        {!item.isAvailable && (
          <div className="mt-2">
            <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuSectionItem;
