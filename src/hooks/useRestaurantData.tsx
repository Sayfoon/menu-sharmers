
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/user';
import { getRestaurantById } from '@/lib/restaurant';
import { Restaurant, User } from '@/types';

export const useRestaurantData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Restaurant, 'id'>>({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisine: '',
    email: '',
    website: '',
    logo: '',
    cover_image: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Redirect to login if not authenticated
        const user = await getCurrentUser();
        console.log('Current user:', user);
        setCurrentUser(user);
        
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to manage your restaurant",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Load restaurant data if user has one
        if (user.restaurantId) {
          console.log('Loading restaurant data for ID:', user.restaurantId);
          const restaurantData = await getRestaurantById(user.restaurantId);
          if (restaurantData) {
            console.log('Restaurant data loaded:', restaurantData);
            setFormData({
              name: restaurantData.name,
              description: restaurantData.description || '',
              address: restaurantData.address,
              phone: restaurantData.phone,
              cuisine: restaurantData.cuisine,
              email: restaurantData.email,
              website: restaurantData.website || '',
              logo: restaurantData.logo || '',
              cover_image: restaurantData.cover_image || '',
            });
          } else {
            console.error('No restaurant data found for ID:', user.restaurantId);
            setError('Failed to load restaurant data');
          }
        } else {
          console.log('User does not have a restaurant yet');
        }
      } catch (error) {
        console.error("Error loading restaurant data:", error);
        setError("Failed to load restaurant data");
        toast({
          title: "Error",
          description: "Failed to load restaurant data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, toast]);

  return {
    currentUser,
    setCurrentUser,
    formData,
    loading,
    error,
    setError,
    isSubmitting,
    setIsSubmitting
  };
};
