
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUser, getMenuItemsBySectionId, deleteMenuItem } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types';
import MenuItemForm from '@/components/menu/MenuItemForm';
import MenuItemsList from '@/components/menu/MenuItemsList';
import { formatPrice } from '@/utils/priceFormatter';

const MenuItems = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();
  const location = useLocation();
  const sectionName = location.state?.sectionName || 'Menu Section';

  const [items, setItems] = useState<MenuItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    is_available: true,
    dietary: [],
    order: 1
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Redirect to login if not authenticated
        const user = await getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        if (!sectionId) {
          toast({
            title: "Error",
            description: "No section ID provided",
            variant: "destructive"
          });
          navigate('/sections');
          return;
        }

        // Load menu items
        const itemsData = await getMenuItemsBySectionId(sectionId);
        setItems(itemsData);

        // Set the order for a new item
        if (!isEditing) {
          setCurrentItem(prev => ({
            ...prev,
            order: itemsData.length + 1,
            section_id: sectionId
          }));
        }
      } catch (error) {
        console.error("Error loading menu items:", error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, sectionId, isEditing]);

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuItem(id);
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    // Reload items
    getMenuItemsBySectionId(sectionId || '')
      .then(newItems => {
        setItems(newItems);
      })
      .catch(error => {
        console.error("Error reloading items:", error);
      });

    // Reset form state
    setCurrentItem({
      name: '',
      description: '',
      price: 0,
      image: '',
      is_available: true,
      dietary: [],
      section_id: sectionId,
      order: items.length + 1
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentItem({
      name: '',
      description: '',
      price: 0,
      image: '',
      is_available: true,
      dietary: [],
      section_id: sectionId,
      order: items.length + 1
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-center">Loading menu items...</p>
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
          <Button variant="outline" onClick={() => navigate('/sections')} className="mb-8">
            &larr; Back to Menu Sections
          </Button>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Menu Items for "{sectionName}"</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage menu items for this section
            </p>
          </div>

          {/* Item Form */}
          <MenuItemForm 
            sectionId={sectionId || ''}
            currentItem={currentItem}
            isEditing={isEditing}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />

          {/* Items List */}
          <MenuItemsList 
            items={items}
            formatPrice={formatPrice}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MenuItems;
