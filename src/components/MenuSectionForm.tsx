
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MenuSection, Restaurant } from '@/types';
import { createMenuSection, updateMenuSection } from '@/lib/data';

interface MenuSectionFormProps {
  restaurant: Restaurant;
  sections: MenuSection[];
  currentSection: Partial<MenuSection>;
  setCurrentSection: React.Dispatch<React.SetStateAction<Partial<MenuSection>>>;
  setSections: React.Dispatch<React.SetStateAction<MenuSection[]>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuSectionForm: React.FC<MenuSectionFormProps> = ({
  restaurant,
  sections,
  currentSection,
  setCurrentSection,
  setSections,
  isEditing,
  setIsEditing
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSection({
      ...currentSection,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restaurant) return;
    
    if (!currentSection.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a section name",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && currentSection.id) {
        const updatedSection = updateMenuSection(currentSection as MenuSection);
        setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
        toast({
          title: "Success",
          description: "Menu section updated successfully"
        });
      } else {
        const newSection = createMenuSection({
          restaurantId: restaurant.id,
          name: currentSection.name,
          description: currentSection.description || '',
          order: sections.length + 1,
          coverImage: currentSection.coverImage || ''
        });
        setSections([...sections, newSection]);
        toast({
          title: "Success",
          description: "Menu section created successfully"
        });
      }
      
      setCurrentSection({
        name: '',
        description: '',
        order: sections.length + 1,
        coverImage: ''
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu section",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setCurrentSection({
      name: '',
      description: '',
      order: sections.length + 1,
      coverImage: ''
    });
    setIsEditing(false);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Menu Section' : 'Add New Menu Section'}</CardTitle>
        <CardDescription>
          Menu sections help organize your dishes into categories
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Section Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={currentSection.name} 
              onChange={handleInputChange} 
              placeholder="e.g., Appetizers, Main Courses, Desserts"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={currentSection.description || ''} 
              onChange={handleInputChange} 
              placeholder="Describe this section of your menu"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
            <Input 
              id="coverImage" 
              name="coverImage" 
              value={currentSection.coverImage || ''} 
              onChange={handleInputChange} 
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500">This image will be used as a background for the section title</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? 'Update Section' : 'Add Section'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MenuSectionForm;
