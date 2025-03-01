
import { Link } from 'react-router-dom';
import { Edit, Trash2, ChevronRight } from 'lucide-react';
import { MenuSection } from '@/types';
import { Button } from '@/components/ui/button';
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
import { deleteMenuSection } from '@/lib/data';
import { useState } from 'react';

interface SectionCardProps {
  section: MenuSection;
  onDeleted: () => void;
}

const SectionCard = ({ section, onDeleted }: SectionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDelete = () => {
    try {
      deleteMenuSection(section.id);
      toast({
        title: "Section deleted",
        description: `${section.name} has been removed from your menu.`,
      });
      onDeleted();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu section",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden card-hover">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{section.name}</h3>
          <div className="flex space-x-1">
            <Link to={`/sections/${section.id}/edit`}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit size={16} className="text-gray-500 hover:text-terracotta-600" />
                <span className="sr-only">Edit</span>
              </Button>
            </Link>
            
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
                    This will delete the "{section.name}" section and ALL menu items within it. 
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
        
        {section.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">{section.description}</p>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Display order: {section.order}
          </div>
          <Link 
            to={`/sections/${section.id}/items`}
            className="flex items-center text-terracotta-600 hover:text-terracotta-700 text-sm font-medium"
          >
            Manage Items
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
