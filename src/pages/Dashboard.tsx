
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRestaurantData } from '@/hooks/useRestaurantData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentUser, 
    allRestaurants, 
    restaurant, 
    loading 
  } = useRestaurantData();
  
  const handleCreateRestaurant = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-10"></div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-48"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If there's no user at this point, return null to prevent any errors
  // The hook should handle the redirect to login
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your restaurant menu and settings from this dashboard
            </p>
          </div>

          {currentUser.restaurantId ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Profile</CardTitle>
                  <CardDescription>Manage your restaurant details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    {restaurant?.logo && (
                      <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <h3 className="font-medium">{restaurant?.name}</h3>
                      <p className="text-sm text-gray-500">{restaurant?.cuisine} cuisine</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate('/profile')} variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Menu Sections</CardTitle>
                  <CardDescription>Organize your menu into sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Create and manage menu sections like appetizers, main courses, desserts and more.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate('/sections')} variant="outline" className="w-full">
                    Manage Sections
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Menu Preview</CardTitle>
                  <CardDescription>See how your menu looks to customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Preview your menu as customers will see it and share your digital menu with others.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate('/menu')} variant="outline" className="w-full">
                    View Menu
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Create Your Restaurant</CardTitle>
                <CardDescription>Get started by setting up your restaurant profile</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You haven't set up a restaurant yet. Create your restaurant profile to get started with your digital menu.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateRestaurant} className="w-full">
                  Create Restaurant Profile
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
