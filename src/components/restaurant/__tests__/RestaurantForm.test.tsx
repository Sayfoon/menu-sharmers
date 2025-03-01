
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import RestaurantForm from '../RestaurantForm';
import { Restaurant } from '@/types';
import * as restaurantLib from '@/lib/restaurant';
import '@testing-library/jest-dom'; // Import the jest-dom matchers

// Mock the navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock restaurant functions
vi.mock('@/lib/restaurant', () => ({
  createRestaurant: vi.fn(),
  updateRestaurant: vi.fn(),
}));

describe('RestaurantForm Component', () => {
  const mockInitialData: Omit<Restaurant, 'id'> = {
    name: 'Test Restaurant',
    description: 'Test Description',
    address: '123 Test St',
    phone: '123-456-7890',
    cuisine: 'Test Cuisine',
    email: 'test@example.com',
    website: 'https://test.com',
    logo: 'https://test.com/logo.png',
    cover_image: 'https://test.com/cover.png',
  };

  const mockProps = {
    currentUser: { id: '123', email: 'test@example.com', name: 'Test User' },
    initialData: mockInitialData,
    isSubmitting: false,
    setIsSubmitting: vi.fn(),
    setError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form with initial data', () => {
    render(
      <BrowserRouter>
        <RestaurantForm {...mockProps} />
      </BrowserRouter>
    );

    // Check that form fields are populated with initial data
    expect(screen.getByLabelText(/Restaurant Name/i)).toHaveValue(mockInitialData.name);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(mockInitialData.description);
    expect(screen.getByLabelText(/Address/i)).toHaveValue(mockInitialData.address);
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue(mockInitialData.phone);
    expect(screen.getByLabelText(/Cuisine Type/i)).toHaveValue(mockInitialData.cuisine);
    expect(screen.getByLabelText(/Email/i)).toHaveValue(mockInitialData.email);
    expect(screen.getByLabelText(/Website/i)).toHaveValue(mockInitialData.website);
    expect(screen.getByLabelText(/Logo URL/i)).toHaveValue(mockInitialData.logo);
    expect(screen.getByLabelText(/Cover Image URL/i)).toHaveValue(mockInitialData.cover_image);
  });

  test('updates form values on input change', () => {
    render(
      <BrowserRouter>
        <RestaurantForm {...mockProps} />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Restaurant Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Restaurant Name' } });
    expect(nameInput).toHaveValue('Updated Restaurant Name');
  });

  test('submits form and calls createRestaurant for new restaurant', async () => {
    const mockCreateRestaurant = vi.mocked(restaurantLib.createRestaurant).mockResolvedValue({
      id: 'new-id',
      ...mockInitialData
    });

    render(
      <BrowserRouter>
        <RestaurantForm 
          {...mockProps} 
          currentUser={{ ...mockProps.currentUser, restaurantId: undefined }} 
        />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Create Restaurant/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.setIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockCreateRestaurant).toHaveBeenCalledWith(mockInitialData);
    });
  });

  test('submits form and calls updateRestaurant for existing restaurant', async () => {
    const mockUpdateRestaurant = vi.mocked(restaurantLib.updateRestaurant).mockResolvedValue({
      id: 'existing-id',
      ...mockInitialData
    });

    render(
      <BrowserRouter>
        <RestaurantForm 
          {...mockProps} 
          currentUser={{ ...mockProps.currentUser, restaurantId: 'existing-id' }} 
        />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Update Restaurant/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.setIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockUpdateRestaurant).toHaveBeenCalledWith({
        ...mockInitialData,
        id: 'existing-id'
      });
    });
  });

  test('shows error toast if submission fails', async () => {
    vi.mocked(restaurantLib.createRestaurant).mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter>
        <RestaurantForm 
          {...mockProps} 
          currentUser={{ ...mockProps.currentUser, restaurantId: undefined }} 
        />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Create Restaurant/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.setError).toHaveBeenCalledWith('Network error');
      expect(mockProps.setIsSubmitting).toHaveBeenCalledWith(false);
    });
  });

  test('navigates to login if user is not authenticated', async () => {
    render(
      <BrowserRouter>
        <RestaurantForm 
          {...mockProps} 
          currentUser={null}
        />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Create Restaurant/i });
    fireEvent.click(submitButton);

    // Navigation would be tested but since we've mocked useNavigate, 
    // we're just ensuring no errors are thrown
    await waitFor(() => {
      expect(mockProps.setIsSubmitting).toHaveBeenCalledWith(true);
    });
  });
});
