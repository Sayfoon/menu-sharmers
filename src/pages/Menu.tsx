
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  getCurrentUser, 
  getRestaurantById, 
  getMenuSectionsByRestaurantId, 
  getMenuItemsBySectionId 
} from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MenuSection as MenuSectionType, MenuItem, Restaurant, User } from '@/types';
import MenuHeader from '@/components/menu/MenuHeader';
import MenuSection from '@/components/menu/MenuSection';
import NoSections from '@/components/menu/NoSections';
import ShareMenu from '@/components/menu/ShareMenu';
import { formatPrice } from '@/utils/formatters';

const Menu = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [sections, setSections] = useState<{ section: MenuSectionType; items: MenuItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (!user) {
          navigate('/login');
          return;
        }

        if (!user.restaurantId) {
          toast({
            title: "Restaurant Required",
            description: "Please create a restaurant profile first",
            variant: "destructive"
          });
          navigate('/profile');
          return;
        }

        const restaurantData = await getRestaurantById(user.restaurantId);
        if (restaurantData) {
          setRestaurant(restaurantData);
          
          const sectionsData = await getMenuSectionsByRestaurantId(restaurantData.id);
          
          // Get items for each section
          const sectionsWithItems = await Promise.all(sectionsData.map(async section => {
            const items = await getMenuItemsBySectionId(section.id);
            return { section, items };
          }));
          
          setSections(sectionsWithItems);
        }
      } catch (error) {
        console.error("Error loading menu data:", error);
        toast({
          title: "Error",
          description: "Failed to load menu data",
          variant: "destructive"
        });
      } finally {
        // Ensure loading is set to false regardless of the outcome
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

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
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-0">
              &larr; Back to Dashboard
            </Button>
            
            {restaurant && <ShareMenu restaurant={restaurant} />}
          </div>
          
          {restaurant && <MenuHeader restaurant={restaurant} />}

          <div className="space-y-12">
            {sections.length > 0 ? (
              sections.map(({ section, items }) => (
                <MenuSection 
                  key={section.id} 
                  section={section} 
                  items={items} 
                  formatPrice={formatPrice} 
                />
              ))
            ) : (
              <NoSections />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
