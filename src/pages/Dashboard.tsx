
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getRestaurantById } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Restaurant, User } from '@/types';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Redirect to login if not authenticated
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        if (!user) {
          navigate('/login');
          return;
        }

        // Load restaurant data if user has one
        if (user.restaurantId) {
          const restaurantData = await getRestaurantById(user.restaurantId);
          if (restaurantData) {
            setRestaurant(restaurantData);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCreateRestaurant = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-center">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
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

          {restaurant ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Profile</CardTitle>
                  <CardDescription>Manage your restaurant details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    {restaurant.logo && (
                      <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500">{restaurant.cuisine} cuisine</p>
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
