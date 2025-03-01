
import React from 'react';
import { MenuSection as MenuSectionType, MenuItem } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import MenuSectionItem from './MenuSectionItem';

interface MenuSectionProps {
  section: MenuSectionType;
  items: MenuItem[];
  formatPrice: (price: number) => string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section, items, formatPrice }) => {
  return (
    <div key={section.id} className="border-t pt-8">
      <h2 className="text-3xl font-semibold mb-6">{section.name}</h2>
      {section.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {section.description}
        </p>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        {items.length > 0 ? items.map(item => (
          <MenuSectionItem key={item.id} item={item} formatPrice={formatPrice} />
        )) : (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>No Items</CardTitle>
              <CardDescription>
                This section doesn't have any menu items yet.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenuSection;
