import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUser, getRestaurantById, getMenuSectionsByRestaurantId, createMenuSection, updateMenuSection, deleteMenuSection } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MenuSection, Restaurant } from '@/types';

const MenuSections = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<MenuSection>>({
    name: '',
    description: '',
    order: 1,
    coverImage: '',
  });
  
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
      setSections(sectionsData);
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSection({
      ...currentSection,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restaurant) return;
    
    if (!currentSection.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a section name",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && currentSection.id) {
        const updatedSection = updateMenuSection(currentSection as MenuSection);
        setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
        toast({
          title: "Success",
          description: "Menu section updated successfully"
        });
      } else {
        const newSection = createMenuSection({
          restaurantId: restaurant.id,
          name: currentSection.name,
          description: currentSection.description || '',
          order: sections.length + 1,
          coverImage: currentSection.coverImage || ''
        });
        setSections([...sections, newSection]);
        toast({
          title: "Success",
          description: "Menu section created successfully"
        });
      }
      
      setCurrentSection({
        name: '',
        description: '',
        order: sections.length + 1,
        coverImage: ''
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu section",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (section: MenuSection) => {
    setCurrentSection(section);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteMenuSection(id);
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

  const handleCancel = () => {
    setCurrentSection({
      name: '',
      description: '',
      order: sections.length + 1,
      coverImage: ''
    });
    setIsEditing(false);
  };

  const handleViewItems = (sectionId: string, sectionName: string) => {
    navigate(`/items/${sectionId}`, { state: { sectionName } });
  };

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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Menu Section' : 'Add New Menu Section'}</CardTitle>
              <CardDescription>
                Menu sections help organize your dishes into categories
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Section Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={currentSection.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Appetizers, Main Courses, Desserts"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={currentSection.description || ''} 
                    onChange={handleInputChange} 
                    placeholder="Describe this section of your menu"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
                  <Input 
                    id="coverImage" 
                    name="coverImage" 
                    value={currentSection.coverImage || ''} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-sm text-gray-500">This image will be used as a background for the section title</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditing ? 'Update Section' : 'Add Section'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {sections.length > 0 ? (
              sections.map((section) => (
                <Card key={section.id} className="overflow-hidden">
                  {section.coverImage && (
                    <div className="relative h-40 w-full">
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${section.coverImage})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <h3 className="text-white text-2xl font-bold px-4 text-center">{section.name}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  <CardHeader className={section.coverImage ? 'pb-2' : ''}>
                    {!section.coverImage && <CardTitle>{section.name}</CardTitle>}
                    {section.description && (
                      <CardDescription>{section.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex justify-between w-full">
                      <Button variant="outline" onClick={() => handleEdit(section)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(section.id)}>
                        Delete
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleViewItems(section.id, section.name)}
                    >
                      Manage Menu Items
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>No Sections Yet</CardTitle>
                  <CardDescription>
                    Create your first menu section above
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

export default MenuSections;
