
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
import { MenuSection as MenuSectionType, MenuItem, Restaurant } from '@/types';
import MenuHeader from '@/components/menu/MenuHeader';
import MenuSection from '@/components/menu/MenuSection';
import NoSections from '@/components/menu/NoSections';
import { formatPrice } from '@/utils/formatters';

const Menu = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [sections, setSections] = useState<{ section: MenuSectionType; items: MenuItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const currentUser = getCurrentUser();

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
    }
    
    // Ensure loading is set to false regardless of the outcome
    setLoading(false);
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
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-8">
            &larr; Back to Dashboard
          </Button>
          
          {restaurant && <MenuHeader restaurant={restaurant} />}

          <div className="space-y-12">
            {sections.map(({ section, items }) => (
              <MenuSection 
                key={section.id} 
                section={section} 
                items={items} 
                formatPrice={formatPrice} 
              />
            ))}
            
            {sections.length === 0 && <NoSections />}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
