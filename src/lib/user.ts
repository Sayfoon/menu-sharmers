
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
      .maybeSingle();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Don't throw here, just return null if profile not found
      return null;
    }
    
    if (!profile) {
      console.error('No profile found for user:', session.user.id);
      return null;
    }
    
    const userData: User = {
      id: session.user.id,
      email: session.user.email || '',
      name: profile.name || '',
      restaurantId: profile.restaurant_id || undefined
    };
    
    console.log('User data constructed:', userData);
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null; // Changed to return null instead of throwing to avoid crashes
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
      .maybeSingle();
      
    if (profileError) {
      console.error('Profile fetch error after login:', profileError);
    }
    
    const userData: User = {
      id: data.user.id,
      email: data.user.email || '',
      name: profile?.name || '',
      restaurantId: profile?.restaurant_id || undefined
    };
    
    console.log('Login successful, user:', userData);
    return userData;
  } catch (error) {
    console.error('Unexpected login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    console.log('Logging out user');
    
    const { error } = await supabase.auth.signOut({ scope: 'local' });
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
    console.log('Registering user:', email);
    
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
    
    console.log('Registration successful, user ID:', data.user.id);
    
    // Auto-login after registration to prevent session loss
    if (!data.session) {
      console.log('No session after registration, attempting login');
      return await login(email, password);
    }
    
    const userData: User = {
      id: data.user.id,
      email: data.user.email || '',
      name: name,
      restaurantId: undefined
    };
    
    return userData;
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
