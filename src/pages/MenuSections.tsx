
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUser, getRestaurantById, getMenuSectionsByRestaurantId, deleteMenuSection } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MenuSection, Restaurant, User } from '@/types';
import MenuSectionForm from '@/components/MenuSectionForm';
import MenuSectionsList from '@/components/MenuSectionsList';

const MenuSections = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<MenuSection>>({
    name: '',
    description: '',
    order: 1,
    cover_image: '',
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
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
          setSections(sectionsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleEdit = (section: MenuSection) => {
    setCurrentSection(section);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuSection(id);
      setSections(sections.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Menu section deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu section",
        variant: "destructive"
      });
    }
  };

  const handleViewItems = (sectionId: string, sectionName: string) => {
    navigate(`/items/${sectionId}`, { state: { sectionName } });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-center">Loading sections...</p>
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
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Menu Sections</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage sections for your menu
            </p>
          </div>

          {restaurant && (
            <>
              <MenuSectionForm 
                restaurant={restaurant}
                sections={sections}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                setSections={setSections}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />

              <MenuSectionsList 
                sections={sections}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewItems={handleViewItems}
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MenuSections;
