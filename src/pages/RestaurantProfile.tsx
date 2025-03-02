
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantLoading from '@/components/restaurant/RestaurantLoading';
import RestaurantForm from '@/components/restaurant/RestaurantForm';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllRestaurants } from '@/lib/restaurant';

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    formData,
    loading,
    error,
    setError,
    isSubmitting, 
    setIsSubmitting,
    refreshData
  } = useRestaurantData();

  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  const fetchAllRestaurants = async () => {
    setLoadingRestaurants(true);
    try {
      const restaurants = await getAllRestaurants();
      setAllRestaurants(restaurants);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  useEffect(() => {
    if (showAllRestaurants) {
      fetchAllRestaurants();
    }
  }, [showAllRestaurants]);

  if (loading) {
    return <RestaurantLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Restaurant Management
          </h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <div className="space-y-12">
            {/* Create New Restaurant Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">
                {currentUser?.restaurantId ? 'Edit Your Restaurant' : 'Create New Restaurant'}
              </h2>
              <RestaurantForm
                currentUser={currentUser}
                initialData={formData}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                setError={setError}
                refreshData={refreshData}
              />
            </div>
            
            {/* View All Restaurants Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">All Restaurants</h2>
                <Button 
                  onClick={() => {
                    setShowAllRestaurants(!showAllRestaurants);
                    if (!showAllRestaurants) fetchAllRestaurants();
                  }}
                >
                  {showAllRestaurants ? 'Hide Restaurants' : 'View All Restaurants'}
                </Button>
              </div>
              
              {showAllRestaurants && (
                <div className="space-y-4">
                  {loadingRestaurants ? (
                    <p className="text-center py-4">Loading restaurants...</p>
                  ) : allRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allRestaurants.map(restaurant => (
                        <Card key={restaurant.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{restaurant.cuisine} cuisine</p>
                            <p className="text-sm mb-1"><strong>Address:</strong> {restaurant.address}</p>
                            <p className="text-sm mb-1"><strong>Phone:</strong> {restaurant.phone}</p>
                            <p className="text-sm"><strong>Email:</strong> {restaurant.email}</p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              onClick={() => navigate('/menu')}
                            >
                              View Menu
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">No restaurants found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantProfile;
