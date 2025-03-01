
import { User } from '../types';
import { supabase } from '../integrations/supabase/client';

// Authentication helpers using Supabase Auth
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
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
    return null;
  }
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('Attempting login for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Supabase login error:', error);
      return null;
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
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
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
    
    // The trigger we created will automatically insert the profile
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
