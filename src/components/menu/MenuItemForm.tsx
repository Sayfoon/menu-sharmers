
import React, { useState } from 'react';
import { MenuItem, dietaryOptions } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { createMenuItem, updateMenuItem } from '@/lib/data';

interface MenuItemFormProps {
  sectionId: string;
  currentItem: Partial<MenuItem>;
  isEditing: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  sectionId, 
  currentItem, 
  isEditing, 
  onSuccess, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>(currentItem);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const toggleDietary = (option: string) => {
    setFormData(prev => {
      const dietary = prev.dietary || [];
      return {
        ...prev,
        dietary: dietary.includes(option)
          ? dietary.filter(d => d !== option)
          : [...dietary, option]
      };
    });
  };

  const toggleAvailability = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_available: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sectionId || !formData.name || formData.price === undefined) {
      toast({
        title: "Missing Information",
        description: "Please provide name and price",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && formData.id) {
        // Update existing item
        await updateMenuItem(formData as MenuItem);
        toast({
          title: "Success",
          description: "Menu item updated successfully"
        });
      } else {
        // Create new item
        await createMenuItem({
          section_id: sectionId,
          name: formData.name,
          description: formData.description || '',
          price: formData.price || 0,
          image: formData.image || '',
          is_available: formData.is_available !== undefined ? formData.is_available : true,
          dietary: formData.dietary || [],
          order: formData.order || 1
        });
        toast({
          title: "Success",
          description: "Menu item created successfully"
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
        <CardDescription>
          Add details about your menu item
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleInputChange} 
              placeholder="e.g., Spaghetti Carbonara"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description || ''} 
              onChange={handleInputChange} 
              placeholder="Describe this menu item"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input 
              id="price" 
              name="price" 
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ''} 
              onChange={handleInputChange} 
              placeholder="9.99"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input 
              id="image" 
              name="image" 
              value={formData.image || ''} 
              onChange={handleInputChange} 
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Availability</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isAvailable" 
                checked={formData.is_available !== undefined ? formData.is_available : true} 
                onCheckedChange={toggleAvailability}
              />
              <label
                htmlFor="isAvailable"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Item is available
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Dietary Options</Label>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`dietary-${option}`} 
                    checked={(formData.dietary || []).includes(option)} 
                    onCheckedChange={() => toggleDietary(option)}
                  />
                  <label
                    htmlFor={`dietary-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MenuItemForm;
