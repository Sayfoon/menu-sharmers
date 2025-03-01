
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateMenuItem, deleteMenuItem } from '@/lib/data';

interface ItemCardProps {
  item: MenuItem;
  onUpdate: () => void;
  onDelete: () => void;
}

const ItemCard = ({ item, onUpdate, onDelete }: ItemCardProps) => {
  const [isAvailable, setIsAvailable] = useState(item.is_available);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAvailabilityToggle = async () => {
    setIsUpdating(true);
    try {
      const updatedItem = { ...item, is_available: !isAvailable };
      await updateMenuItem(updatedItem);
      setIsAvailable(!isAvailable);
      onUpdate();
      toast({
        title: `Item ${!isAvailable ? 'Available' : 'Unavailable'}`,
        description: `${item.name} is now ${!isAvailable ? 'available' : 'unavailable'} on your menu.`,
      });
    } catch (error) {
      console.error('Error updating item availability:', error);
      toast({
        title: "Error",
        description: "Failed to update item availability",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenuItem(item.id);
      onDelete();
      toast({
        title: "Item deleted",
        description: `${item.name} has been removed from your menu.`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden card-hover">
      <div className="flex flex-col sm:flex-row">
        {item.image && (
          <div className="sm:w-1/3 h-48 sm:h-auto">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&h=400')}
            />
          </div>
        )}
        
        <div className={`flex-1 p-6 ${!item.image ? 'w-full' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              {item.name}
              {!isAvailable && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  (Unavailable)
                </span>
              )}
            </h3>
            <div className="flex space-x-1">
              <Link to={`/sections/${item.section_id}/items/${item.id}/edit`}>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit size={16} className="text-gray-500 hover:text-terracotta-600" />
                  <span className="sr-only">Edit</span>
                </Button>
              </Link>
              
              <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Trash2 size={16} className="text-gray-500 hover:text-red-600" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{item.name}" from your menu.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{item.description}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.dietary.map((diet) => (
              <Badge key={diet} variant="outline" className="bg-terracotta-50 text-terracotta-700 border-terracotta-200">
                {diet}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-terracotta-600">{formatPrice(item.price)}</p>
            
            <div className="flex items-center">
              <span className="text-sm mr-2 text-gray-600 dark:text-gray-300">
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
                disabled={isUpdating}
                className="data-[state=checked]:bg-terracotta-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
