
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
  coverImage?: string;
}

export interface MenuSection {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  order: number;
  coverImage?: string;
}

export interface MenuItem {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  dietary: string[];
  order: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Make password optional
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
