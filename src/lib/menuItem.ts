
import { MenuItem } from '../types';

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

// Helper function to get menu items by section ID
export const getMenuItemsBySectionId = (sectionId: string): MenuItem[] => {
  return menuItems
    .filter(item => item.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
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
