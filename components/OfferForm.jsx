"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { X } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function OfferForm({ offer, categories,isEditing, products, onCancel }) {
  // Main form state containing all field values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    products: [],
    categories: [],
    startDate: '',
    endDate: '',
    minPurchaseAmount: '',
    banner: null,
  });

  // States for selected items and their details
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router=useRouter()

  // Initialize form data when editing an existing offer
  useEffect(() => {
    if (offer) {
      setFormData({
        ...offer,
        startDate: formatDate(new Date(offer.startDate)),
        endDate: formatDate(new Date(offer.endDate)),
        products: offer.products || [],
        categories: offer.categories || [],
      });

      // Initialize selected items with their details
      const productDetails = offer.products?.map(id => {
        const product = products.find(p => p._id === id);
        return product ? { id: product._id, name: product.name } : null;
      }).filter(Boolean) || [];
      
      const categoryDetails = offer.categories?.map(id => {
        const category = categories.find(c => c._id === id);
        return category ? { id: category._id, name: category.name } : null;
      }).filter(Boolean) || [];

      setSelectedProducts(productDetails);
      setSelectedCategories(categoryDetails);

      if (offer.banner) {
        setPreviewImage(offer.banner);
      }
    }
  }, [offer, products, categories]);

  // Helper function to format dates
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Handle changes for regular input fields
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      handleImageUpload(e);
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  // Handle changes for single-select dropdowns
  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Enhanced handlers for product and category selection
  const handleProductChange = (value) => {
    const selectedProduct = products.find(p => p._id === value);
    if (selectedProduct && !selectedProducts.some(p => p.id === value)) {
      const newProduct = { id: value, name: selectedProduct.name };
      setSelectedProducts(prev => [...prev, newProduct]);
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, value]
      }));
    }
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find(c => c._id === value);
    if (selectedCategory && !selectedCategories.some(c => c.id === value)) {
      const newCategory = { id: value, name: selectedCategory.name };
      setSelectedCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    }
  };

  // Handlers for removing selected items
  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(id => id !== productId)
    }));
  };

  const removeCategory = (categoryId) => {
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(id => id !== categoryId)
    }));
  };

  // Handlers for clearing all selections
  const clearProducts = () => {
    setSelectedProducts([]);
    setFormData(prev => ({ ...prev, products: [] }));
  };

  const clearCategories = () => {
    setSelectedCategories([]);
    setFormData(prev => ({ ...prev, categories: [] }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadUrlResponse = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`);
      const { url, filename } = uploadUrlResponse.data;

      await axios.put(url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      const previewResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`);

      setFormData(prev => ({
        ...prev,
        banner: previewResponse.data.url
      }));
      setPreviewImage(previewResponse.data.url);
      showNotification('Image uploaded successfully');
    } catch (error) {
      console.error('Error in image upload:', error);
      showNotification('Failed to upload image', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const showNotification = (message, type = 'success') => {
    // Implement your notification logic here
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = {
      ...formData,
      startDate: formData.startDate.toString(),
      endDate: formData.endDate.toString()
    };
    
    try {
      let res;
      if (isEditing) {
        res = await axios.post(`https://backend.gezeno.in/api/editOffers/${offer._id}`, formDataToSubmit);
      } else {
        res = await axios.post('https://backend.gezeno.in/api/offers/apply', formDataToSubmit);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Implement error handling (e.g., show error message to user)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-h-[calc(100vh-180px)] overflow-y-auto"
    >
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Basic Information Section */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Discount Configuration Section */}
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select 
                name="discountType" 
                value={formData.discountType} 
                onValueChange={(value) => handleSelectChange('discountType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input 
                id="discountValue" 
                name="discountValue" 
                type="number" 
                value={formData.discountValue} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Applicability Section */}
            {/* <div className="space-y-2">
              <Label htmlFor="applicableTo">Applicable To</Label>
              <Select 
                name="applicableTo" 
                value={formData.applicableTo} 
                onValueChange={(value) => handleSelectChange('applicableTo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select applicable to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="categories">Categories</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Enhanced Categories Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="categories">Categories</Label>
                {selectedCategories.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearCategories}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <Select
                name="categories"
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category._id} 
                      value={category._id}
                      className={selectedCategories.some(c => c.id === category._id) ? 'opacity-50' : ''}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategories.length > 0 && (
                <div className="mt-2 space-y-2 ">
                  {selectedCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border-2  border-teal-300 "
                    >
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Products Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="products">Products</Label>
                {selectedProducts.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearProducts}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <Select
                name="products"
                onValueChange={handleProductChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select products" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem 
                      key={product._id} 
                      value={product._id}
                      className={selectedProducts.some(p => p.id === product._id) ? 'opacity-50' : ''}
                    >
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProducts.length > 0 && (
                <div className="mt-2 space-y-2 ">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border-2  border-teal-300 "
                    >
                      <span className="text-sm text-gray-700">{product.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Configuration Section */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (dd/mm/yy)</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (dd/mm/yy)</Label>
              <Input 
                id="endDate" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Purchase Requirements Section */}
            <div className="space-y-2">
              <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount</Label>
              <Input 
                id="minPurchaseAmount" 
                name="minPurchaseAmount" 
                type="number" 
                value={formData.minPurchaseAmount} 
                onChange={handleChange} 
              />
            </div>

            {/* Banner Image Section */}
            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image</Label>
              <Input 
                id="banner" 
                name="banner" 
                type="file" 
                onChange={handleChange} 
                accept="image/*" 
                disabled={isUploading}
              />
              {isUploading && (
                <div className="mt-2">
                  <progress value={uploadProgress} max="100" className="w-full" />
                  <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Banner preview" 
                  className="mt-2 max-w-full h-auto rounded-md" 
                />
              )}
            </div>
          </CardContent>

          {/* Form Actions */}
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Offer' : 'Create Offer'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}

export default OfferForm;

