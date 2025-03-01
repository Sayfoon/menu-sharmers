
import { User } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'password123', // In a real app, this would be hashed
    restaurantId: '1'
  }
];

// Authentication helpers using localStorage to simulate a JSON file database
const USERS_STORAGE_KEY = 'sharmers-menus-users';
const CURRENT_USER_KEY = 'sharmers-menus-current-user';

// Load users from localStorage
export const loadUsers = (): User[] => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Initialize with mock data if no users exist
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return users;
};

// Save users to localStorage
export const saveUsers = (updatedUsers: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
};

// Load current user from localStorage
export const loadCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

// Save current user to localStorage
export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Initialize current user from localStorage or default to first user for demo
let currentUser: User | null = loadCurrentUser();

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const login = (email: string, password: string): User | null => {
  const allUsers = loadUsers();
  const user = allUsers.find(user => user.email === email && user.password === password);
  if (user) {
    currentUser = user;
    saveCurrentUser(user);
    return user;
  }
  return null;
};

export const logout = (): void => {
  currentUser = null;
  saveCurrentUser(null);
};

export const register = (name: string, email: string, password: string): User | null => {
  const allUsers = loadUsers();
  
  // Check if user already exists
  if (allUsers.some(user => user.email === email)) {
    return null;
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // In a real app, this would be hashed
  };
  
  allUsers.push(newUser);
  saveUsers(allUsers);
  
  // Log in the new user
  currentUser = newUser;
  saveCurrentUser(newUser);
  
  return newUser;
};
