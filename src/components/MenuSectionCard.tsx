
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuSection } from '@/types';

interface MenuSectionCardProps {
  section: MenuSection;
  onEdit: (section: MenuSection) => void;
  onDelete: (id: string) => void;
  onViewItems: (sectionId: string, sectionName: string) => void;
}

const MenuSectionCard: React.FC<MenuSectionCardProps> = ({ 
  section, 
  onEdit, 
  onDelete, 
  onViewItems 
}) => {
  return (
    <Card className="overflow-hidden">
      {section.cover_image && (
        <div className="relative h-40 w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${section.cover_image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold px-4 text-center">{section.name}</h3>
            </div>
          </div>
        </div>
      )}
      <CardHeader className={section.cover_image ? 'pb-2' : ''}>
        {!section.cover_image && <CardTitle>{section.name}</CardTitle>}
        {section.description && (
          <CardDescription>{section.description}</CardDescription>
        )}
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={() => onEdit(section)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(section.id)}>
            Delete
          </Button>
        </div>
        <Button 
          className="w-full" 
          onClick={() => onViewItems(section.id, section.name)}
        >
          Manage Menu Items
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuSectionCard;
