'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, PackageX, Trash2, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

function OfferList({ offers, onSelectOffer, onDeleteOffer }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, offerId: null });
  const [selectedOffer, setSelectedOffer] = useState(null);

  if (!offers || offers.length === 0) {
    return (
      <Card className="h-[calc(100vh-120px)] flex items-center justify-center">
        <CardContent className="text-center">
          <PackageX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Offers Available</h3>
          <p className="text-sm text-muted-foreground">
            There are currently no offers. Create a new offer to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteClick = (e, offerId) => {
    e.stopPropagation();
    setDeleteConfirmation({ isOpen: true, offerId });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.offerId) {
      try {
        await axios.post(`https://backend.gezeno.in/api/offers/delete/${deleteConfirmation.offerId}`);
        onDeleteOffer(deleteConfirmation.offerId);
        setDeleteConfirmation({ isOpen: false, offerId: null });
        console.log('Offer deleted successfully');
      } catch (error) {
        console.error('Error deleting offer:', error);
      }
    }
  };

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
  };

  const handleEditClick = (e, offer) => {
    e.stopPropagation();
    onSelectOffer(offer);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-4 max-h-[calc(100vh-120px)] overflow-y-auto transition-all duration-300 ease-in-out">
        {offers.map((offer, index) => (
          <motion.div
            key={offer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
            onClick={() => handleOfferClick(offer)}
          >
            <Card className="overflow-hidden transition-all duration-300 ease-in-out h-64 w-full cursor-pointer group">
              <div className="relative h-full w-full overflow-hidden">
                {offer.banner ? (
                  <>
                    <img
                      src={offer.banner}
                      alt={`${offer.name} banner`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-primary/5" />
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 group-hover:translate-y-[-8px]">
                  <h3 className="text-lg font-bold text-white mb-2">{offer.name}</h3>
                  <p className="text-sm text-white mb-2 line-clamp-2">{offer.description}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-white">
                    <span className="text-sm font-semibold mb-1 sm:mb-0">
                      {offer.discountType === 'percentage' ? `${offer.discountValue}% Off` : `$${offer.discountValue} Off`}
                    </span>
                    <span className="text-xs">
                      {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => handleEditClick(e, offer)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => handleDeleteClick(e, offer._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(isOpen) => setDeleteConfirmation({ isOpen, offerId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this offer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedOffer?.name}</DialogTitle>
            <DialogDescription>
              Offer details
            </DialogDescription>
          </DialogHeader>
          {selectedOffer && (
            <div className="py-4">
              {selectedOffer.banner && (
                <div className="mb-4 relative h-48 w-full">
                  <img
                    src={selectedOffer.banner}
                    alt={`${selectedOffer.name} banner`}
                    className="absolute inset-0 h-full w-full object-cover rounded-md"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-2">{selectedOffer.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Discount</h4>
                  <p>{selectedOffer.discountType === 'percentage' ? `${selectedOffer.discountValue}%` : `$${selectedOffer.discountValue}`}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Discount Type</h4>
                  <p className="capitalize">{selectedOffer.discountType}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Start Date</h4>
                  <p>{new Date(selectedOffer.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold">End Date</h4>
                  <p>{new Date(selectedOffer.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedOffer(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OfferList;

