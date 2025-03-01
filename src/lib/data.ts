
import { Restaurant, MenuSection, MenuItem, User } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    restaurantId: '1'
  }
];

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

// Mock Menu Sections
export const menuSections: MenuSection[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Appetizers',
    description: 'Start your meal with these delicious appetizers',
    order: 1
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Pasta',
    description: 'Homemade pasta dishes with fresh ingredients',
    order: 2
  },
  {
    id: '3',
    restaurantId: '1',
    name: 'Main Courses',
    description: 'Signature dishes prepared by our chef',
    order: 3
  },
  {
    id: '4',
    restaurantId: '1',
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    order: 4
  }
];

// Mock Menu Items
export const menuItems: MenuItem[] = [
  {
    id: '1',
    sectionId: '1',
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: ['Vegetarian'],
    order: 1
  },
  {
    id: '2',
    sectionId: '1',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil with a balsamic glaze',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    order: 2
  },
  {
    id: '3',
    sectionId: '2',
    name: 'Spaghetti Carbonara',
    description: 'Classic pasta with pancetta, eggs, Parmesan, and black pepper',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: [],
    order: 1
  },
  {
    id: '4',
    sectionId: '2',
    name: 'Penne Arrabbiata',
    description: 'Spicy tomato sauce with garlic and red chili peppers',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: ['Vegetarian', 'Vegan'],
    order: 2
  },
  {
    id: '5',
    sectionId: '3',
    name: 'Chicken Marsala',
    description: 'Pan-seared chicken with mushrooms and Marsala wine sauce',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: ['Dairy-Free'],
    order: 1
  },
  {
    id: '6',
    sectionId: '3',
    name: 'Grilled Salmon',
    description: 'Fresh salmon with lemon herb butter, served with seasonal vegetables',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: ['Gluten-Free'],
    order: 2
  },
  {
    id: '7',
    sectionId: '4',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: ['Vegetarian'],
    order: 1
  },
  {
    id: '8',
    sectionId: '4',
    name: 'Panna Cotta',
    description: 'Silky vanilla cream dessert with berry compote',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400',
    isAvailable: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    order: 2
  }
];

// Helper function to get restaurant by ID
export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

// Helper function to get menu sections by restaurant ID
export const getMenuSectionsByRestaurantId = (restaurantId: string): MenuSection[] => {
  return menuSections
    .filter(section => section.restaurantId === restaurantId)
    .sort((a, b) => a.order - b.order);
};

// Helper function to get menu items by section ID
export const getMenuItemsBySectionId = (sectionId: string): MenuItem[] => {
  return menuItems
    .filter(item => item.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
};

// Authentication helpers (mock)
let currentUser: User | null = users[0]; // For demo purposes, default to first user

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const login = (email: string, password: string): User | null => {
  // In a real app, we'd validate credentials
  const user = users.find(user => user.email === email);
  if (user) {
    currentUser = user;
    return user;
  }
  return null;
};

export const logout = (): void => {
  currentUser = null;
};

export const register = (name: string, email: string, password: string): User => {
  // In a real app, we'd validate and save to database
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
  };
  users.push(newUser);
  currentUser = newUser;
  return newUser;
};

// CRUD operations for restaurant
export const createRestaurant = (restaurant: Omit<Restaurant, 'id'>): Restaurant => {
  const newRestaurant: Restaurant = {
    ...restaurant,
    id: `restaurant-${Date.now()}`
  };
  restaurants.push(newRestaurant);
  
  // Update current user
  if (currentUser) {
    currentUser.restaurantId = newRestaurant.id;
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

// CRUD operations for menu sections
export const createMenuSection = (section: Omit<MenuSection, 'id'>): MenuSection => {
  const newSection: MenuSection = {
    ...section,
    id: `section-${Date.now()}`
  };
  menuSections.push(newSection);
  return newSection;
};

export const updateMenuSection = (section: MenuSection): MenuSection => {
  const index = menuSections.findIndex(s => s.id === section.id);
  if (index >= 0) {
    menuSections[index] = section;
    return section;
  }
  throw new Error('Menu section not found');
};

export const deleteMenuSection = (id: string): void => {
  const index = menuSections.findIndex(s => s.id === id);
  if (index >= 0) {
    menuSections.splice(index, 1);
    
    // Also delete all menu items in this section
    const itemsToRemove = menuItems.filter(item => item.sectionId === id);
    itemsToRemove.forEach(item => {
      const itemIndex = menuItems.findIndex(i => i.id === item.id);
      if (itemIndex >= 0) {
        menuItems.splice(itemIndex, 1);
      }
    });
  }
};

// CRUD operations for menu items
export const createMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
  const newItem: MenuItem = {
    ...item,
    id: `item-${Date.now()}`
  };
  menuItems.push(newItem);
  return newItem;
};

export const updateMenuItem = (item: MenuItem): MenuItem => {
  const index = menuItems.findIndex(i => i.id === item.id);
  if (index >= 0) {
    menuItems[index] = item;
    return item;
  }
  throw new Error('Menu item not found');
};

export const deleteMenuItem = (id: string): void => {
  const index = menuItems.findIndex(i => i.id === id);
  if (index >= 0) {
    menuItems.splice(index, 1);
  }
};
