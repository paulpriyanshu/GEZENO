import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

const OfferButton = ({ isFormVisible, onClick }) => {
  return (
    <Button onClick={onClick} variant="outline">
      {isFormVisible ? (
        <>
          <X className="mr-2 h-4 w-4" /> Hide Form
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" /> Create New Offer
        </>
      )}
    </Button>
  );
};

export default OfferButton;

