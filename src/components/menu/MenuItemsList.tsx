
import React from 'react';
import { MenuItem } from '@/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MenuItemCard from './MenuItemCard';

interface MenuItemsListProps {
  items: MenuItem[];
  formatPrice: (price: number) => string;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({ items, formatPrice, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>No Items Yet</CardTitle>
          <CardDescription>
            Create your first menu item above
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <MenuItemCard 
          key={item.id}
          item={item}
          formatPrice={formatPrice}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MenuItemsList;
