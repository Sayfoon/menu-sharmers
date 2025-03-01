
import React from 'react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface MenuItemCardProps {
  item: MenuItem;
  formatPrice: (price: number) => string;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, formatPrice, onEdit, onDelete }) => {
  return (
    <Card key={item.id}>
      <div className="relative">
        {item.image && (
          <div className="h-40 rounded-t-lg overflow-hidden">
            <div 
              className="h-full w-full bg-cover bg-center" 
              style={{ backgroundImage: `url(${item.image})` }}
            />
          </div>
        )}
        {!item.is_available && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
            Unavailable
          </div>
        )}
      </div>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(item)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(item.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
