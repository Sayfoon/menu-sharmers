
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
      <div className="flex">
        {item.image && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <div 
              className="h-full w-full bg-cover bg-center" 
              style={{ backgroundImage: `url(${item.image})` }}
            />
          </div>
        )}
        <div className="flex-1">
          <CardHeader className="py-3 px-4">
            <div className="flex justify-between items-start">
              <CardTitle className="mr-2 text-base sm:text-lg">{item.name}</CardTitle>
              <div className="font-bold text-base sm:text-lg">{formatPrice(item.price)}</div>
            </div>
            <CardDescription className="mt-1 text-xs sm:text-sm line-clamp-2">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-3">
            {item.dietary && item.dietary.length > 0 && (
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
            {!item.is_available && (
              <div className="mt-2">
                <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                  Currently Unavailable
                </span>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default MenuSectionItem;
