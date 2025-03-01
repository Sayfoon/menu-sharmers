
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { MenuItem, DietaryOption, dietaryOptions } from '@/types';
import { createMenuItem, updateMenuItem, getMenuItemsBySectionId } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

interface MenuItemFormProps {
  sectionId: string;
  item?: MenuItem;
  isEditMode?: boolean;
}

const MenuItemForm = ({ sectionId, item, isEditMode = false }: MenuItemFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    image: item?.image || '',
    is_available: item?.is_available ?? true,
    dietary: item?.dietary || [],
    section_id: item?.section_id || sectionId,
    order: item?.order || 1,
  });

  useEffect(() => {
    const loadItems = async () => {
      try {
        const menuItems = await getMenuItemsBySectionId(sectionId);
        setItems(menuItems);
        
        // Set default order if not editing
        if (!isEditMode && menuItems.length > 0) {
          const maxOrder = Math.max(...menuItems.map(i => i.order));
          setFormData(prev => ({ ...prev, order: maxOrder + 1 }));
        }
      } catch (error) {
        console.error("Error loading menu items:", error);
      }
    };
    
    loadItems();
  }, [sectionId, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Handle price as a number
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_available: checked }));
  };

  const handleDietaryChange = (dietary: DietaryOption, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        dietary: [...prev.dietary, dietary]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dietary: prev.dietary.filter(d => d !== dietary)
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditMode && item) {
        await updateMenuItem({ ...formData, id: item.id });
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      } else {
        await createMenuItem(formData);
        toast({
          title: "Success",
          description: "Menu item created successfully",
        });
      }
      navigate(`/sections/${sectionId}/items`);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
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
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Caesar Salad"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your menu item"
            rows={3}
            required
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="pl-7"
              />
            </div>
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
          </div>
        </div>
        
        <div>
          <Label htmlFor="image">Image URL (Optional)</Label>
          <Input
            id="image"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            placeholder="URL to an image of this item"
            className="mt-1"
          />
          {formData.image && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={formData.image} 
                alt="Item preview" 
                className="h-40 w-auto object-cover rounded-md border"
                onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400')}
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_available"
            checked={formData.is_available}
            onCheckedChange={handleAvailabilityChange}
            className="data-[state=checked]:bg-terracotta-600"
          />
          <Label htmlFor="is_available">Item is currently available</Label>
        </div>
        
        <div>
          <Label className="block mb-2">Dietary Information</Label>
          <div className="grid grid-cols-2 gap-3">
            {dietaryOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`dietary-${option}`}
                  checked={formData.dietary.includes(option)}
                  onCheckedChange={(checked) => 
                    handleDietaryChange(option, checked as boolean)
                  }
                  className="data-[state=checked]:bg-terracotta-600 data-[state=checked]:border-terracotta-600"
                />
                <Label 
                  htmlFor={`dietary-${option}`}
                  className="text-sm font-normal"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(`/sections/${sectionId}/items`)}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-terracotta-600 hover:bg-terracotta-700"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;
