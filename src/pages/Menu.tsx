
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { 
  getCurrentUser, 
  getRestaurantById, 
  getMenuSectionsByRestaurantId, 
  getMenuItemsBySectionId 
} from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { MenuSection, MenuItem, Restaurant } from '@/types';

const Menu = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [sections, setSections] = useState<{ section: MenuSection; items: MenuItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!currentUser.restaurantId) {
      toast({
        title: "Restaurant Required",
        description: "Please create a restaurant profile first",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }

    const restaurantData = getRestaurantById(currentUser.restaurantId);
    if (restaurantData) {
      setRestaurant(restaurantData);
      
      const sectionsData = getMenuSectionsByRestaurantId(restaurantData.id);
      
      // Get items for each section
      const sectionsWithItems = sectionsData.map(section => {
        const items = getMenuItemsBySectionId(section.id);
        return { section, items };
      });
      
      setSections(sectionsWithItems);
      setLoading(false);
    }
  }, [currentUser, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-center">Loading menu...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-8">
            &larr; Back to Dashboard
          </Button>
          
          {restaurant && (
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {restaurant.logo && (
                  <img 
                    src={restaurant.logo} 
                    alt={`${restaurant.name} logo`} 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold">{restaurant.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {restaurant.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
                <span>{restaurant.address}</span>
                <span>{restaurant.phone}</span>
                {restaurant.website && <span>{restaurant.website}</span>}
              </div>
            </div>
          )}

          <div className="space-y-12">
            {sections.map(({ section, items }) => (
              <div key={section.id} className="border-t pt-8">
                <h2 className="text-3xl font-semibold mb-6">{section.name}</h2>
                {section.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {section.description}
                  </p>
                )}
                
                <div className="grid gap-6 md:grid-cols-2">
                  {items.length > 0 ? items.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      {item.image && (
                        <div className="h-40 w-full">
                          <div 
                            className="h-full w-full bg-cover bg-center" 
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="mr-2">{item.name}</CardTitle>
                          <div className="font-bold text-lg">{formatPrice(item.price)}</div>
                        </div>
                        <CardDescription className="mt-1">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {item.dietary.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.dietary.map(option => (
                              <span 
                                key={option} 
                                className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                        )}
                        {!item.isAvailable && (
                          <div className="mt-2">
                            <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) : (
                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle>No Items</CardTitle>
                        <CardDescription>
                          This section doesn't have any menu items yet.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              </div>
            ))}
            
            {sections.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>No Menu Sections</CardTitle>
                  <CardDescription>
                    You haven't created any menu sections yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/sections')}>
                    Create Menu Sections
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
