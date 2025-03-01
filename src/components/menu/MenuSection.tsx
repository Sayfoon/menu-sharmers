
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
      <div className={`rounded-lg overflow-hidden mb-6 ${section.coverImage ? 'h-48' : ''}`}>
        {section.coverImage ? (
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${section.coverImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center flex-col p-4">
              <h2 className="text-3xl font-semibold text-white">{section.name}</h2>
              {section.description && (
                <p className="text-white text-center mt-2">
                  {section.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mb-6">{section.name}</h2>
            {section.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {section.description}
              </p>
            )}
          </>
        )}
      </div>
      
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
