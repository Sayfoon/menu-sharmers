
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MenuSection } from '@/types';
import { createMenuSection, updateMenuSection, getMenuSectionsByRestaurantId, getCurrentUser } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

interface MenuSectionFormProps {
  section?: MenuSection;
  isEditMode?: boolean;
}

const MenuSectionForm = ({ section, isEditMode = false }: MenuSectionFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = getCurrentUser();
  
  if (!currentUser?.restaurantId) {
    navigate('/profile');
    toast({
      title: "No restaurant found",
      description: "Please create a restaurant profile first",
      variant: "destructive",
    });
    return null;
  }
  
  const [formData, setFormData] = useState<Omit<MenuSection, 'id'>>({
    name: section?.name || '',
    description: section?.description || '',
    restaurantId: section?.restaurantId || currentUser.restaurantId,
    order: section?.order || getNextSectionOrder(),
  });

  function getNextSectionOrder(): number {
    if (!currentUser.restaurantId) return 1;
    const sections = getMenuSectionsByRestaurantId(currentUser.restaurantId);
    return sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 1;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditMode && section) {
        await updateMenuSection({ ...formData, id: section.id });
        toast({
          title: "Success",
          description: "Menu section updated successfully",
        });
      } else {
        await createMenuSection(formData);
        toast({
          title: "Success",
          description: "Menu section created successfully",
        });
      }
      navigate('/sections');
    } catch (error) {
      console.error('Error saving menu section:', error);
      toast({
        title: "Error",
        description: "Failed to save menu section",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Section Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Appetizers, Main Courses, Desserts"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description of this menu section"
            rows={3}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            min="1"
            step="1"
            value={formData.order}
            onChange={handleChange}
            required
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            This determines the order in which sections appear on your menu (lower numbers appear first)
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/sections')}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-terracotta-600 hover:bg-terracotta-700"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Section' : 'Create Section'}
        </Button>
      </div>
    </form>
  );
};

export default MenuSectionForm;
