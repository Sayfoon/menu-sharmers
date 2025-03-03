
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  getRestaurantById, 
  getMenuSectionsByRestaurantId, 
  getMenuItemsBySectionId 
} from '@/lib/data';
import Footer from '@/components/Footer';
import { MenuSection as MenuSectionType, MenuItem, Restaurant } from '@/types';
import MenuHeader from '@/components/menu/MenuHeader';
import MenuSection from '@/components/menu/MenuSection';
import NoSections from '@/components/menu/NoSections';
import { formatPrice } from '@/utils/formatters';
import PublicMenuNavbar from '@/components/menu/PublicMenuNavbar';

const PublicMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [sections, setSections] = useState<{ section: MenuSectionType; items: MenuItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) {
        toast({
          title: "Error",
          description: "Restaurant ID is missing",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      try {
        const restaurantData = await getRestaurantById(restaurantId);
        if (restaurantData) {
          setRestaurant(restaurantData);
          
          const sectionsData = await getMenuSectionsByRestaurantId(restaurantData.id);
          
          // Get items for each section
          const sectionsWithItems = await Promise.all(sectionsData.map(async section => {
            const items = await getMenuItemsBySectionId(section.id);
            // Filter out unavailable items
            const availableItems = items.filter(item => item.is_available);
            return { section, items: availableItems };
          }));
          
          // Filter out sections with no items
          const nonEmptySections = sectionsWithItems.filter(section => section.items.length > 0);
          
          setSections(nonEmptySections);
        } else {
          toast({
            title: "Error",
            description: "Restaurant not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading public menu data:", error);
        toast({
          title: "Error",
          description: "Failed to load menu data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [restaurantId, toast]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PublicMenuNavbar restaurant={null} />
        <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <PublicMenuNavbar restaurant={null} />
        <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Menu Not Found</h1>
            <p>The restaurant menu you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicMenuNavbar restaurant={restaurant} />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
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

export default PublicMenu;
