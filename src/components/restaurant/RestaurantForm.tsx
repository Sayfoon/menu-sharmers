
import React, { useState } from 'react';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createRestaurant, updateRestaurant } from '@/lib/restaurant';

interface RestaurantFormProps {
  currentUser: any;
  initialData: Omit<Restaurant, 'id'>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  setError: (value: string | null) => void;
}

const RestaurantForm = ({ 
  currentUser, 
  initialData, 
  isSubmitting, 
  setIsSubmitting, 
  setError 
}: RestaurantFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Restaurant, 'id'>>(initialData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save restaurant information",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      console.log('Submitting restaurant data:', formData);
      
      if (currentUser.restaurantId) {
        // Update existing restaurant
        console.log('Updating existing restaurant with ID:', currentUser.restaurantId);
        await updateRestaurant({ 
          ...formData, 
          id: currentUser.restaurantId 
        });
        toast({
          title: "Success",
          description: "Restaurant updated successfully",
        });
      } else {
        // Create new restaurant
        console.log('Creating new restaurant');
        const newRestaurant = await createRestaurant(formData);
        console.log('Restaurant created:', newRestaurant);
        toast({
          title: "Success",
          description: "Restaurant created successfully",
        });
      }
      
      // Navigate back to dashboard after successful operation
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving restaurant:', error);
      setError(error.message || 'Failed to save restaurant information');
      toast({
        title: "Error",
        description: error.message || "Failed to save restaurant information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = Boolean(currentUser?.restaurantId);

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
        
        <div>
          <Label htmlFor="cover_image">Cover Image URL (Optional)</Label>
          <Input
            id="cover_image"
            name="cover_image"
            value={formData.cover_image || ''}
            onChange={handleChange}
            placeholder="URL to your restaurant cover image"
            className="mt-1"
          />
          {formData.cover_image && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={formData.cover_image} 
                alt="Cover image preview" 
                className="h-32 w-full object-cover rounded-md border"
                onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&h=250')}
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
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Restaurant' : 'Create Restaurant'}
        </Button>
      </div>
    </form>
  );
};

export default RestaurantForm;
