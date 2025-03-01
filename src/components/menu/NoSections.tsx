
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const NoSections: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>No Menu Sections</CardTitle>
        <CardDescription>
          You haven't created any menu sections yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => navigate('/sections')}>
          Create Menu Sections
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoSections;
