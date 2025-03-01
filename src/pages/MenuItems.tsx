import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUser, getMenuItemsBySectionId, createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MenuItem, dietaryOptions } from '@/types';

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
            order: itemsData.length + 1
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setCurrentItem({
        ...currentItem,
        [name]: parseFloat(value) || 0
      });
    } else {
      setCurrentItem({
        ...currentItem,
        [name]: value
      });
    }
  };

  const toggleDietary = (option: string) => {
    setCurrentItem(prev => {
      const dietary = prev.dietary || [];
      return {
        ...prev,
        dietary: dietary.includes(option)
          ? dietary.filter(d => d !== option)
          : [...dietary, option]
      };
    });
  };

  const toggleAvailability = (value: boolean) => {
    setCurrentItem(prev => ({
      ...prev,
      is_available: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sectionId) return;
    
    if (!currentItem.name || currentItem.price === undefined) {
      toast({
        title: "Missing Information",
        description: "Please provide name and price",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && currentItem.id) {
        // Update existing item
        const updatedItem = await updateMenuItem(currentItem as MenuItem);
        setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
        toast({
          title: "Success",
          description: "Menu item updated successfully"
        });
      } else {
        // Create new item
        const newItem = await createMenuItem({
          section_id: sectionId,
          name: currentItem.name,
          description: currentItem.description || '',
          price: currentItem.price || 0,
          image: currentItem.image || '',
          is_available: currentItem.is_available !== undefined ? currentItem.is_available : true,
          dietary: currentItem.dietary || [],
          order: items.length + 1
        });
        setItems([...items, newItem]);
        toast({
          title: "Success",
          description: "Menu item created successfully"
        });
      }
      
      // Reset form
      setCurrentItem({
        name: '',
        description: '',
        price: 0,
        image: '',
        is_available: true,
        dietary: [],
        order: items.length + 1
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive"
      });
    }
  };

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

  const handleCancel = () => {
    setCurrentItem({
      name: '',
      description: '',
      price: 0,
      image: '',
      is_available: true,
      dietary: [],
      order: items.length + 1
    });
    setIsEditing(false);
  };

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
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
              <CardDescription>
                Add details about your menu item
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={currentItem.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Spaghetti Carbonara"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={currentItem.description || ''} 
                    onChange={handleInputChange} 
                    placeholder="Describe this menu item"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentItem.price} 
                    onChange={handleInputChange} 
                    placeholder="9.99"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={currentItem.image || ''} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isAvailable" 
                      checked={currentItem.is_available !== undefined ? currentItem.is_available : true} 
                      onCheckedChange={toggleAvailability}
                    />
                    <label
                      htmlFor="isAvailable"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Item is available
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Dietary Options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dietaryOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`dietary-${option}`} 
                          checked={(currentItem.dietary || []).includes(option)} 
                          onCheckedChange={() => toggleDietary(option)}
                        />
                        <label
                          htmlFor={`dietary-${option}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditing ? 'Update Item' : 'Add Item'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Items List */}
          <div className="grid gap-6 md:grid-cols-2">
            {items.length > 0 ? (
              items.map((item) => (
                <Card key={item.id}>
                  <div className="relative">
                    {item.image && (
                      <div className="h-40 rounded-t-lg overflow-hidden">
                        <div 
                          className="h-full w-full bg-cover bg-center" 
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      </div>
                    )}
                    {!item.is_available && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                        Unavailable
                      </div>
                    )}
                  </div>
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
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>No Items Yet</CardTitle>
                  <CardDescription>
                    Create your first menu item above
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MenuItems;
