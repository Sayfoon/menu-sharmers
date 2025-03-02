
import { User } from '../types';
import { supabase } from '../integrations/supabase/client';

// Get the current user from the session
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log("Checking for current session...");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session error:", error.message);
      return null;
    }
    
    if (!data.session) {
      console.log("No active session found");
      return null;
    }
    
    console.log("Session found:", data.session.user.id);
    
    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }
    
    return {
      id: data.session.user.id,
      email: data.session.user.email || '',
      name: profile?.name || '',
      restaurantId: profile?.restaurant_id || undefined
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Login with email and password
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log(`Attempting login with email: ${email}`);
    
    // Clear any existing session first to prevent conflicts
    await supabase.auth.signOut();
    console.log("Cleared existing session");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error.message, error);
      throw error;
    }
    
    if (!data.user) {
      console.error("Login failed: No user returned");
      throw new Error('Login failed');
    }
    
    console.log("Auth response success:", data);
    console.log("User authenticated:", data.user.id);
    console.log("Session created:", !!data.session);
    
    if (!data.session) {
      console.error("No session created after login");
      throw new Error('Session creation failed');
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    } else {
      console.log("Profile retrieved:", profile);
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: profile?.name || '',
      restaurantId: profile?.restaurant_id || undefined
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register a new user
export const register = async (name: string, email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (error || !data.user) {
      throw error || new Error('Registration failed');
    }
    
    // Auto-login after registration if no session
    if (!data.session) {
      return await login(email, password);
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: name,
      restaurantId: undefined
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout the current user
export const logout = async (): Promise<void> => {
  console.log("Logging out user");
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    console.log("Logout successful");
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Update the restaurant ID for a user
export const updateUserRestaurantId = async (userId: string, restaurantId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ restaurant_id: restaurantId })
      .eq('id', userId);
      
    return !error;
  } catch (error) {
    console.error('Error updating restaurant ID:', error);
    return false;
  }
};
