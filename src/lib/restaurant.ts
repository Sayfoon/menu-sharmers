
import { Restaurant } from '../types';

// Update storage key constant for consistent access
const RESTAURANTS_STORAGE_KEY = 'sharmers-menus-restaurants';

// Load restaurants from localStorage
export const loadRestaurants = (): Restaurant[] => {
  const storedRestaurants = localStorage.getItem(RESTAURANTS_STORAGE_KEY);
  if (storedRestaurants) {
    return JSON.parse(storedRestaurants);
  }
  
  // Initialize with mock data if no restaurants exist
  const initialRestaurants = [
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
  
  localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(initialRestaurants));
  return initialRestaurants;
};

// Save restaurants to localStorage
export const saveRestaurants = (restaurants: Restaurant[]): void => {
  localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(restaurants));
};

// Initial load of restaurants
let restaurants: Restaurant[] = loadRestaurants();

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
  
  // Add to in-memory array
  restaurants.push(newRestaurant);
  
  // Save to localStorage
  saveRestaurants(restaurants);
  
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
    saveRestaurants(restaurants);
    return restaurant;
  }
  
  // If restaurant doesn't exist, create it instead of throwing an error
  const newRestaurant: Restaurant = {
    ...restaurant
  };
  restaurants.push(newRestaurant);
  saveRestaurants(restaurants);
  return newRestaurant;
};

// Export these functions to manage restaurant data
export const getAllRestaurants = (): Restaurant[] => {
  return [...restaurants];
};
