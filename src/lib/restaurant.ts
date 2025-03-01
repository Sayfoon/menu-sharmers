
import { Restaurant } from '../types';

// Mock Restaurant Data
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Cucina',
    description: 'Authentic Italian cuisine in a cozy atmosphere',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    cuisine: 'Italian',
    email: 'info@bellacucina.com',
    website: 'bellacucina.com',
    logo: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=150&h=150'
  }
];

// Helper function to get restaurant by ID
export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

// CRUD operations for restaurant
export const createRestaurant = (restaurant: Omit<Restaurant, 'id'>): Restaurant => {
  const newRestaurant: Restaurant = {
    ...restaurant,
    id: `restaurant-${Date.now()}`
  };
  restaurants.push(newRestaurant);
  
  // Update current user
  const currentUser = localStorage.getItem('sharmers-menus-current-user');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    user.restaurantId = newRestaurant.id;
    localStorage.setItem('sharmers-menus-current-user', JSON.stringify(user));
  }
  
  return newRestaurant;
};

export const updateRestaurant = (restaurant: Restaurant): Restaurant => {
  const index = restaurants.findIndex(r => r.id === restaurant.id);
  if (index >= 0) {
    restaurants[index] = restaurant;
    return restaurant;
  }
  throw new Error('Restaurant not found');
};
