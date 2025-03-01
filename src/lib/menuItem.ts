
import { MenuItem } from '../types';
import { supabase } from '../integrations/supabase/client';

// Helper function to get menu items by section ID
export const getMenuItemsBySectionId = async (sectionId: string): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('section_id', sectionId)
      .order('order');

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }

    return data as MenuItem[];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// CRUD operations for menu items
export const createMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        section_id: item.section_id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        is_available: item.is_available,
        dietary: item.dietary,
        order: item.order
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }

    return data as MenuItem;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({
        section_id: item.section_id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        is_available: item.is_available,
        dietary: item.dietary,
        order: item.order
      })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }

    return data as MenuItem;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Helper function to delete all menu items in a section
export const deleteMenuItemsBySectionId = async (sectionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('section_id', sectionId);

    if (error) {
      console.error('Error deleting menu items by section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting menu items by section:', error);
    throw error;
  }
};
