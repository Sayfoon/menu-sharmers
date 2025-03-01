
import { MenuSection } from '../types';
import { supabase } from '../integrations/supabase/client';
import { deleteMenuItemsBySectionId } from './menuItem';

// Helper function to get menu sections by restaurant ID
export const getMenuSectionsByRestaurantId = async (restaurantId: string): Promise<MenuSection[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_sections')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('order');

    if (error) {
      console.error('Error fetching menu sections:', error);
      return [];
    }

    return data as MenuSection[];
  } catch (error) {
    console.error('Error fetching menu sections:', error);
    return [];
  }
};

// CRUD operations for menu sections
export const createMenuSection = async (section: Omit<MenuSection, 'id'>): Promise<MenuSection> => {
  try {
    const { data, error } = await supabase
      .from('menu_sections')
      .insert([section])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu section:', error);
      throw error;
    }

    return data as MenuSection;
  } catch (error) {
    console.error('Error creating menu section:', error);
    throw error;
  }
};

export const updateMenuSection = async (section: MenuSection): Promise<MenuSection> => {
  try {
    const { data, error } = await supabase
      .from('menu_sections')
      .update(section)
      .eq('id', section.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu section:', error);
      throw error;
    }

    return data as MenuSection;
  } catch (error) {
    console.error('Error updating menu section:', error);
    throw error;
  }
};

export const deleteMenuSection = async (id: string): Promise<void> => {
  try {
    // We don't need to delete menu items manually as Supabase
    // will handle cascading deletes with ON DELETE CASCADE
    const { error } = await supabase
      .from('menu_sections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting menu section:', error);
    throw error;
  }
};
