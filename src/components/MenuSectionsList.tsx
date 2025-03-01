
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuSection } from '@/types';
import MenuSectionCard from './MenuSectionCard';

interface MenuSectionsListProps {
  sections: MenuSection[];
  onEdit: (section: MenuSection) => void;
  onDelete: (id: string) => void;
  onViewItems: (sectionId: string, sectionName: string) => void;
}

const MenuSectionsList: React.FC<MenuSectionsListProps> = ({ 
  sections, 
  onEdit, 
  onDelete, 
  onViewItems 
}) => {
  if (sections.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>No Sections Yet</CardTitle>
          <CardDescription>
            Create your first menu section above
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sections.map((section) => (
        <MenuSectionCard 
          key={section.id}
          section={section}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewItems={onViewItems}
        />
      ))}
    </div>
  );
};

export default MenuSectionsList;
