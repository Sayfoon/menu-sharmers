
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types';
import { createRestaurant, updateRestaurant } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

interface RestaurantFormProps {
  restaurant?: Restaurant;
  isEditMode?: boolean;
}

const RestaurantForm = ({ restaurant, isEditMode = false }: RestaurantFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Restaurant, 'id'>>({
    name: restaurant?.name || '',
    description: restaurant?.description || '',
    address: restaurant?.address || '',
    phone: restaurant?.phone || '',
    cuisine: restaurant?.cuisine || '',
    email: restaurant?.email || '',
    website: restaurant?.website || '',
    logo: restaurant?.logo || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditMode && restaurant) {
        await updateRestaurant({ ...formData, id: restaurant.id });
        toast({
          title: "Success",
          description: "Restaurant updated successfully",
        });
      } else {
        await createRestaurant(formData);
        toast({
          title: "Success",
          description: "Restaurant created successfully",
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to save restaurant information",
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
          <Label htmlFor="name">Restaurant Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Bella Cucina"
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
            placeholder="Short description of your restaurant"
            rows={3}
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cuisine">Cuisine Type</Label>
            <Input
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="e.g. Italian, Mexican, etc."
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. (555) 123-4567"
              required
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full restaurant address"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@yourrestaurant.com"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="e.g. www.yourrestaurant.com"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="logo">Logo URL (Optional)</Label>
          <Input
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="URL to your restaurant logo"
            className="mt-1"
          />
          {formData.logo && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={formData.logo} 
                alt="Logo preview" 
                className="h-16 w-16 object-cover rounded-md border"
                onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=150&h=150')}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-terracotta-600 hover:bg-terracotta-700"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Restaurant' : 'Create Restaurant'}
        </Button>
      </div>
    </form>
  );
};

export default RestaurantForm;
