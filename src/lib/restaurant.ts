
import { Restaurant } from '../types';
import { supabase } from '../integrations/supabase/client';
import { getCurrentUser, updateUserRestaurantId } from './user';

// Helper function to get restaurant by ID
export const getRestaurantById = async (id: string): Promise<Restaurant | undefined> => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching restaurant:', error);
      return undefined;
    }

    return data as Restaurant;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return undefined;
  }
};

// CRUD operations for restaurant
export const createRestaurant = async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
  try {
    console.log('Creating restaurant:', restaurant);
    
    const { data, error } = await supabase
      .from('restaurants')
      .insert([restaurant])
      .select()
      .single();

    if (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }

    console.log('Restaurant created successfully:', data);

    // Update the user's restaurant_id
    const user = await getCurrentUser();
    if (user && data.id) {
      const updated = await updateUserRestaurantId(user.id, data.id);
      if (!updated) {
        console.error('Failed to update user restaurant ID');
      } else {
        console.log('User restaurant ID updated successfully');
      }
    }

    return data as Restaurant;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (restaurant: Restaurant): Promise<Restaurant> => {
  try {
    console.log('Updating restaurant:', restaurant);
    
    const { data, error } = await supabase
      .from('restaurants')
      .update(restaurant)
      .eq('id', restaurant.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }

    console.log('Restaurant updated successfully:', data);
    return data as Restaurant;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

// Export these functions to manage restaurant data
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');

    if (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }

    return data as Restaurant[];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};

// Function to check if restaurant belongs to the current user
export const isRestaurantOwner = async (restaurantId: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user.id)
    .single();

  return data?.restaurant_id === restaurantId;
};
