
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/user';
import { getRestaurantById, getAllRestaurants as fetchAllRestaurants } from '@/lib/restaurant';
import { Restaurant, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useRestaurantData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
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
      setLoading(true);
      console.log('Fetching user and restaurant data...');
      
      // Attempt to get current user
      const user = await getCurrentUser();
      console.log('Current user from getCurrentUser:', user);
      
      if (!user) {
        console.log('No active session found, redirecting to login');
        navigate('/login');
        return;
      }
      
      setCurrentUser(user);

      // Load restaurant data if user has one
      if (user.restaurantId) {
        console.log('Loading restaurant data for ID:', user.restaurantId);
        const restaurantData = await getRestaurantById(user.restaurantId);
        if (restaurantData) {
          console.log('Restaurant data loaded:', restaurantData);
          setRestaurant(restaurantData);
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

  // Listen for auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
        console.log('User is signed in, fetching data');
        await fetchUserAndRestaurantData();
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        setCurrentUser(null);
        navigate('/login');
      }
    });

    // Initial data load
    fetchUserAndRestaurantData();
    getAllRestaurants();

    // Clean up subscription when component unmounts
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchUserAndRestaurantData, getAllRestaurants, navigate]);

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
    getAllRestaurants,
    restaurant
  };
};
