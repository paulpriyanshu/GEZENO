"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import OfferList from '@/components/OfferList';
import OfferForm from '@/components/OfferForm';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import OfferButton from "@/components/OfferButton"
import { Spinner } from "@/components/spinner"

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing,setIsEditing]=useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchOffers(), fetchCategories(), fetchProducts()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if(selectedOffer) setIsEditing(true)
    fetchData();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get('https://backend.gezeno.in/api/offers/');
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://backend.gezeno.in/api/getFlatCategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://backend.gezeno.in/api/getProducts/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateOffer = async (offerData) => {
    try {
      const formData = new FormData();
      for (const key in offerData) {
        if (key === 'banner') {
          formData.append('banner', offerData.banner);
        } else if (Array.isArray(offerData[key])) {
          offerData[key].forEach(value => formData.append(`${key}[]`, value));
        } else {
          formData.append(key, offerData[key]);
        }
      }
      await axios.post('https://backend.gezeno.in/api/offers/apply', offerData);
      fetchOffers();
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleUpdateOffer = async (id, offerData) => {
    try {
      const formData = new FormData();
      for (const key in offerData) {
        if (key === 'banner' && offerData.banner instanceof File) {
          formData.append('banner', offerData.banner);
        } else if (Array.isArray(offerData[key])) {
          offerData[key].forEach(value => formData.append(`${key}[]`, value));
        } else {
          formData.append(key, offerData[key]);
        }
      }
      console.log("this is editing",id)
      await axios.post(`https://backend.gezeno.in/api/editOffers/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchOffers();
      setSelectedOffer(null);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  const handleCreateNewOffer = () => {
    setSelectedOffer(null);
    setIsFormVisible(prev => !prev);
  };

  const handleDeleteOffer = (deletedOfferId) => {
    setOffers(prevOffers => prevOffers.filter(offer => offer._id !== deletedOfferId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner className="w-20 h-20" />
        </div>
      </div>
    );
  }
//   useEffect(()=>{
//     if(selectedOffer){
//         seIsEditing(true)
//     }
//   },[])

  return (
    <div className="container mx-auto p-4 min-h-screen transition-colors duration-300 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold text-primary">Offer Management</h1>
        <div className="flex items-center space-x-5">
          <OfferButton
            isFormVisible={isFormVisible}
            onClick={handleCreateNewOffer}
          />
        </div>
      </motion.div>
      <div className="flex flex-col md:flex-row">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: isFormVisible ? '60%' : '100%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <OfferList 
            offers={offers} 
            onSelectOffer={(offer) => {
              setSelectedOffer(offer);
              setIsFormVisible(true);
            }}
            onDeleteOffer={handleDeleteOffer}
          />
        </motion.div>
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="md:ml-4 mt-4 md:mt-0 md:w-2/5"
            >
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                {selectedOffer ? 'Edit Offer' : 'Create New Offer'}
              </h2>
              <OfferForm
                offer={selectedOffer}
                categories={categories}
                isEditing
                products={products}
                onCancel={() => {
                  setSelectedOffer(null);
                  setIsFormVisible(false);
                }}
                onSubmit={selectedOffer ? handleUpdateOffer : handleCreateOffer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

