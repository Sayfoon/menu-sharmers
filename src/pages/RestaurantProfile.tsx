
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantLoading from '@/components/restaurant/RestaurantLoading';
import RestaurantForm from '@/components/restaurant/RestaurantForm';
import { useRestaurantData } from '@/hooks/useRestaurantData';

const RestaurantProfile = () => {
  const {
    currentUser,
    formData,
    loading,
    error,
    setError,
    isSubmitting, 
    setIsSubmitting
  } = useRestaurantData();

  if (loading) {
    return <RestaurantLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {currentUser?.restaurantId ? 'Edit Restaurant Profile' : 'Create Restaurant Profile'}
          </h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <RestaurantForm
            currentUser={currentUser}
            initialData={formData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setError={setError}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantProfile;
