
import { User } from '../types';
import { supabase } from '../integrations/supabase/client';

// Authentication helpers using Supabase Auth
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (!profile) return null;
  
  return {
    id: session.user.id,
    email: session.user.email || '',
    name: profile.name || '',
    restaurantId: profile.restaurant_id || undefined
  };
};

export const login = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error || !data.session) {
    console.error('Login error:', error);
    return null;
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: profile?.name || '',
    restaurantId: profile?.restaurant_id || undefined
  };
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const register = async (name: string, email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
  
  if (error || !data.user) {
    console.error('Registration error:', error);
    return null;
  }
  
  // The trigger we created will automatically insert the profile
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: name,
    restaurantId: undefined
  };
};

// Update restaurant ID for a user
export const updateUserRestaurantId = async (userId: string, restaurantId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update({ restaurant_id: restaurantId })
    .eq('id', userId);
    
  return !error;
};
