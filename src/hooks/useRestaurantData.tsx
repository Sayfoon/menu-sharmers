
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/user';
import { getRestaurantById, getAllRestaurants as fetchAllRestaurants } from '@/lib/restaurant';
import { Restaurant, User } from '@/types';

export const useRestaurantData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  
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

  const fetchUserAndRestaurantData = useCallback(async () => {
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
          console.log('No restaurant data found for ID:', user.restaurantId);
          // Clear form data for a new restaurant
          setFormData({
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
  }, [navigate, toast]);

  const getAllRestaurants = useCallback(async () => {
    setLoadingRestaurants(true);
    try {
      const restaurants = await fetchAllRestaurants();
      setAllRestaurants(restaurants);
      console.log('All restaurants loaded:', restaurants);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
      setError("Failed to fetch restaurants");
    } finally {
      setLoadingRestaurants(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchUserAndRestaurantData();
    getAllRestaurants();
  }, [fetchUserAndRestaurantData, getAllRestaurants]);

  return {
    currentUser,
    setCurrentUser,
    formData,
    setFormData,
    loading,
    error,
    setError,
    isSubmitting,
    setIsSubmitting,
    refreshData: fetchUserAndRestaurantData,
    allRestaurants,
    loadingRestaurants,
    getAllRestaurants
  };
};
