import { User } from '../types';
import { supabase } from '../integrations/supabase/client';

// Authentication helpers using Supabase Auth
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }
    
    if (!session) {
      console.log('No active session found');
      return null;
    }
    
    console.log('Session found, fetching profile for user:', session.user.id);
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Don't throw here, just return null if profile not found
      return null;
    }
    
    if (!profile) {
      console.error('No profile found for user:', session.user.id);
      return null;
    }
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile.name || '',
      restaurantId: profile.restaurant_id || undefined
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('Attempting login for:', email);
    
    // Don't clear existing session before logging in
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Supabase login error:', error);
      throw error;
    }
    
    if (!data.session) {
      console.error('No session returned after login');
      return null;
    }
    
    console.log('Login successful, fetching profile');
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      console.error('Profile fetch error after login:', profileError);
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: profile?.name || '',
      restaurantId: profile?.restaurant_id || undefined
    };
  } catch (error) {
    console.error('Unexpected login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Only clear localStorage when user explicitly logs out
    // Don't call this function automatically
    localStorage.clear();
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (error) {
      console.error('Registration error:', error);
      return null;
    }
    
    if (!data.user) {
      console.error('No user returned after registration');
      return null;
    }
    
    console.log('Registration successful');
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: name,
      restaurantId: undefined
    };
  } catch (error) {
    console.error('Unexpected registration error:', error);
    return null;
  }
};

// Update restaurant ID for a user
export const updateUserRestaurantId = async (userId: string, restaurantId: string): Promise<boolean> => {
  try {
    console.log(`Updating restaurant ID for user ${userId} to ${restaurantId}`);
    const { error } = await supabase
      .from('profiles')
      .update({ restaurant_id: restaurantId })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating restaurant ID:', error);
      return false;
    }
    
    console.log('Restaurant ID updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating restaurant ID:', error);
    return false;
  }
};

// Get a restaurant by ID without authentication
export const getPublicRestaurantById = async (restaurantId: string): Promise<Restaurant | null> => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();
      
    if (error) {
      console.error('Error fetching public restaurant:', error);
      return null;
    }
    
    return data as Restaurant;
  } catch (error) {
    console.error('Unexpected error fetching public restaurant:', error);
    return null;
  }
};
