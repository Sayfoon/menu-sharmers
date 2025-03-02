import { User } from '../types';
import { supabase } from '../integrations/supabase/client';

// Authentication helpers using Supabase Auth
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null; // Return null instead of throwing to avoid blocking UI
    }
    
    if (!session) {
      console.log('No active session found');
      return null;
    }
    
    console.log('Session found, fetching profile for user:', session.user.id);
    
    // Check if a profile exists for this user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Don't throw here, just return the base user without profile data
      return {
        id: session.user.id,
        email: session.user.email || '',
        name: '',
        restaurantId: undefined
      };
    }
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.name || '',
      restaurantId: profile?.restaurant_id || undefined
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null; // Return null instead of throwing to avoid blocking UI
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
    // Clear any local storage or IndexedDB data to ensure complete logout
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
    console.log('Starting registration in user.ts for:', email);
    
    // First, ensure no existing session to avoid conflicts
    console.log('Clearing any existing session...');
    await supabase.auth.signOut();
    
    console.log('Calling supabase.auth.signUp with:', { email, name });
    
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
      console.error('Supabase registration error:', error);
      throw error; 
    }
    
    if (!data.user) {
      console.error('No user returned after registration');
      return null;
    }
    
    console.log('Registration successful, user created with ID:', data.user.id);
    
    // Important: After successful registration, need to sign in the user explicitly
    if (!data.session) {
      console.log('No session after registration, signing in explicitly...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.error('Error signing in after registration:', signInError);
        throw signInError;
      }
      
      console.log('Sign-in after registration successful:', signInData.session ? 'Session created' : 'No session created');
    } else {
      console.log('Session created during registration');
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: name,
      restaurantId: undefined
    };
  } catch (error) {
    console.error('Unexpected registration error:', error);
    throw error;
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
