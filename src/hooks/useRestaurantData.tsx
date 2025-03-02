
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/user';
import { getRestaurantById, getAllRestaurants as fetchAllRestaurants, getCurrentUserRestaurant } from '@/lib/restaurant';
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
      // Attempt to get current user, but don't redirect if not found
      const user = await getCurrentUser();
      console.log('Current user from fetchUserAndRestaurantData:', user);
      setCurrentUser(user);
      
      if (!user) {
        console.log('No authenticated user found');
        setLoading(false);
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

  // Add auth state change listener to maintain session
  useEffect(() => {
    let isMounted = true;
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed in useRestaurantData:', event, session);
        
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            const user = await getCurrentUser();
            setCurrentUser(user);
            console.log('User set after auth change:', user);
          } catch (err) {
            console.error('Error fetching user after auth state change:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );

    // Initial data load with a slight delay to avoid race conditions
    setTimeout(() => {
      if (isMounted) {
        fetchUserAndRestaurantData();
        getAllRestaurants();
      }
    }, 100);

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
