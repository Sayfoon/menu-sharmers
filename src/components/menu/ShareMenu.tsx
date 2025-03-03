
import React, { useState } from 'react';
import { Link, Share, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Restaurant } from '@/types';

interface ShareMenuProps {
  restaurant: Restaurant;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ restaurant }) => {
  const [copied, setCopied] = useState(false);
  const publicLink = `${window.location.origin}/m/${restaurant.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "The menu link has been copied to your clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share size={16} />
          <span>Share Menu</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Menu</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Share this link with your customers to view your menu:
          </p>
          <div className="flex items-center space-x-2">
            <div className="relative w-full">
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <Link size={16} />
              </div>
              <Input
                className="pl-9 pr-24"
                readOnly
                value={publicLink}
              />
              <Button 
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-xs"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
                <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => window.open(publicLink, '_blank')}>
              Preview Menu
            </Button>
            <Button onClick={copyToClipboard}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMenu;
