
import { MenuSection } from '../types';
import { menuItems } from './menuItem';

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

// Helper function to get menu sections by restaurant ID
export const getMenuSectionsByRestaurantId = (restaurantId: string): MenuSection[] => {
  return menuSections
    .filter(section => section.restaurantId === restaurantId)
    .sort((a, b) => a.order - b.order);
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
