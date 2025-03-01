
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  cuisine: string;
  email: string;
  website?: string;
  logo?: string;
  cover_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuSection {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  order: number;
  cover_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  section_id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  is_available: boolean;
  dietary: string[];
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  restaurantId?: string;
}

export type DietaryOption = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Dairy-Free' | 'Nut-Free' | 'Seafood-Free';

export const dietaryOptions: DietaryOption[] = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Seafood-Free'
];

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}
