
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, createRestaurant, getRestaurantById, updateRestaurant } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Restaurant } from '@/types';

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Restaurant, 'id'>>({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisine: '',
    email: '',
    website: '',
    logo: '',
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load restaurant data if user has one
    if (currentUser.restaurantId) {
      const restaurantData = getRestaurantById(currentUser.restaurantId);
      if (restaurantData) {
        setFormData({
          name: restaurantData.name,
          description: restaurantData.description,
          address: restaurantData.address,
          phone: restaurantData.phone,
          cuisine: restaurantData.cuisine,
          email: restaurantData.email,
          website: restaurantData.website || '',
          logo: restaurantData.logo || '',
        });
      }
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (currentUser?.restaurantId) {
        // Update existing restaurant
        const updatedRestaurant = updateRestaurant({ 
          ...formData, 
          id: currentUser.restaurantId 
        });
        toast({
          title: "Success",
          description: "Restaurant updated successfully",
        });
      } else {
        // Create new restaurant
        createRestaurant(formData);
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

  const isEditMode = Boolean(currentUser?.restaurantId);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {isEditMode ? 'Edit Restaurant Profile' : 'Create Restaurant Profile'}
          </h1>
          
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
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Restaurant' : 'Create Restaurant'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantProfile;
