'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Trash2, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from 'react-hot-toast'
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [productVariants, setProductVariants] = useState({})
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [currentVariant, setCurrentVariant] = useState(null)
  const [variantImageFile, setVariantImageFile] = useState(null)
  const [variantUploadProgress, setVariantUploadProgress] = useState(0)

  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    shortDetails: '',
    description: '',
    productSpecs: '',
    ratings: 0,
    metatitle: '',
    metakeyword: '',
    metadescription: '',
    metascript: '',
    price: '',
    discountedPrice: '',
    category: '',
    subCategory: '',
    subSubCategory: '',
    subSubSubCategory: '',
    brand: '',
    images: [],
    stock: '',
    isActive: true,
  })

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          axios.get('https://backend.gezeno.in/api/getProducts'),
          axios.get('https://backend.gezeno.in/api/getCategories'),
          axios.get('https://backend.gezeno.in/api/getallbrands'),
        ])
        setProducts(productsRes.data)
        setFilteredProducts(productsRes.data)
        setCategories(categoriesRes.data)
        setBrands(brandsRes.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchQuery, products])

  const handleSearch = useCallback(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      (product.description && product.description.toLowerCase().includes(lowercasedQuery)) ||
      (product.category && product.category.name && product.category.name.toLowerCase().includes(lowercasedQuery)) ||
      (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(lowercasedQuery))
    )
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch()
    if (filteredProducts.length === 0) {
      showNotification("No products found. Try a different search term.", 'error')
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleDeleteProduct = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/deleteproduct/${id}`)
      setProducts(products.filter(product => product._id !== id))
      setFilteredProducts(filteredProducts.filter(product => product._id !== id))
      showNotification("Product deleted successfully")
    } catch (err) {
      console.error('Error deleting product:', err)
      showNotification("Failed to delete product. Please try again.", 'error')
    }
  }

  const handleEditProduct = (product) => {
    setCurrentProduct({
      ...product,
      category: product.category?._id || '',
      subCategory: product.subCategory?.[0]?._id || '',
      subSubCategory: product.subSubCategory?.[0]?._id || '',
      subSubSubCategory: product.subSubSubCategory?.[0]?._id || '',
      brand: product.brand?._id || '',
    })
    setIsEditing(true)
    setShowProductDialog(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentProduct(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleCategoryChange = (categoryId) => {
    setCurrentProduct(prev => ({
      ...prev,
      category: categoryId,
      subCategory: '',
      subSubCategory: '',
      subSubSubCategory: '',
    }))
    setErrors(prev => ({ ...prev, category: undefined }))
  }

  const handleSubCategoryChange = (subCategoryId) => {
    setCurrentProduct(prev => ({
      ...prev,
      subCategory: subCategoryId,
      subSubCategory: '',
      subSubSubCategory: '',
    }))
  }

  const handleSubSubCategoryChange = (subSubCategoryId) => {
    setCurrentProduct(prev => ({
      ...prev,
      subSubCategory: subSubCategoryId,
      subSubSubCategory: '',
    }))
  }

  const handleSubSubSubCategoryChange = (subSubSubCategoryId) => {
    setCurrentProduct(prev => ({
      ...prev,
      subSubSubCategory: subSubSubCategoryId,
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const uploadPromises = files.map(async (file) => {
        const uploadUrlResponse = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`)
        const { url, filename } = uploadUrlResponse.data

        await axios.put(url, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(prev => Math.min(prev + (percentCompleted / files.length), 100))
          }
        })

        const previewResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`)
        
        return { url: previewResponse.data.url, filename }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      
      setCurrentProduct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))
      setErrors(prev => ({ ...prev, images: undefined }))

      showNotification(`Successfully uploaded ${uploadedImages.length} images`)
    } catch (error) {
      console.error('Error in batch upload:', error)
      showNotification('Failed to process image uploads', 'error')  
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveImage = (imageIndex) => {
    setCurrentProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }))
  }

  const validateProduct = (product) => {
    const newErrors = {}
    if (!product.name.trim()) newErrors.name = "Name is required"
    if (!product.price || product.price <= 0) newErrors.price = "Valid price is required"
    if (!product.description.trim()) newErrors.description = "Description is required"
    if (!product.stock || product.stock < 0) newErrors.stock = "Valid stock quantity is required"
    if (!product.category) newErrors.category = "Category is required"
    return newErrors
  }

  const handleProductSubmit = async () => {
    if (isUploading) {
      showNotification("Please wait for image upload to complete", 'error')
      return
    }

    const validationErrors = validateProduct(currentProduct)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showNotification("Please fill all required fields", 'error')
      return
    }

    try {
      setLoading(true)
      const productData = {
        ...currentProduct,
        price: parseFloat(currentProduct.price),
        discountedPrice: parseFloat(currentProduct.discountedPrice) || undefined,
        stock: parseInt(currentProduct.stock, 10),
        ratings: parseFloat(currentProduct.ratings) || 0,
      }

      const categoryFields = ['category', 'subCategory', 'subSubCategory', 'subSubSubCategory']
      categoryFields.forEach(field => {
        if (!productData[field]) {
          delete productData[field]
        }
      })

      if (isEditing) {
        await axios.post(`https://backend.gezeno.in/api/update-product/${currentProduct._id}`, productData)
        showNotification("Product updated successfully")
      } else {
        await axios.post('https://backend.gezeno.in/api/createProduct', productData)
        showNotification("Product added successfully")
      }
      setShowProductDialog(false)
      const updatedProducts = await axios.get('https://backend.gezeno.in/api/getProducts')
      setProducts(updatedProducts.data)
      setFilteredProducts(updatedProducts.data)
      resetProductForm()
    } catch (err) {
      console.error('Error submitting product:', err)
      showNotification(err.response?.data?.message || (isEditing ? "Failed to update product" : "Failed to add product"), 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetProductForm = () => {
    setCurrentProduct({
      name: '',
      shortDetails: '',
      description: '',
      productSpecs: '',
      ratings: 0,
      metatitle: '',
      metakeyword: '',
      metadescription: '',
      metascript: '',
      price: '',
      discountedPrice: '',
      category: '',
      subCategory: '',
      subSubCategory: '',
      subSubSubCategory: '',
      brand: '',
      images: [],
      stock: '',
      isActive: true,
    })
    setIsEditing(false)
    setErrors({})
  }

  const sortByPrice = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })

    setFilteredProducts(sortedProducts)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const fetchProductVariants = async (productId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/get-product-variants/${productId}`)
      if (response.data.success) {
        setProductVariants(prevVariants => ({
          ...prevVariants,
          [productId]: response.data.data
        }))
      }
    } catch (error) {
      console.error('Error fetching product variants:', error)
    }
  }

  const toggleProductExpansion = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null)
    } else {
      setExpandedProduct(productId)
      fetchProductVariants(productId)
    }
  }

  const handleEditVariant = (variant) => {
    setCurrentVariant(variant)
    setShowVariantDialog(true)
  }

  const handleDeleteVariant = async (variantId) => {
    try {
      await axios.delete(`https://backend.gezeno.in/api/delete-product-variant/${variantId}`)
      showNotification("Variant deleted successfully")
      if (expandedProduct) {
        fetchProductVariants(expandedProduct)
      }
    } catch (error) {
      console.error('Error deleting variant:', error)
      showNotification("Failed to delete variant", 'error')
    }
  }

  const handleVariantImageUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setVariantUploadProgress(0);
    try {
      const uploadUrlResponse = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`);
      const { url, filename } = uploadUrlResponse.data;

      await axios.put(url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setVariantUploadProgress(percentCompleted);
        }
      });

      const previewResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`);
      setVariantUploadProgress(100);
      return { url: previewResponse.data.url, filename };
    } catch (error) {
      console.error('Error uploading variant image:', error);
      showNotification('Failed to upload variant image', 'error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setVariantUploadProgress(0), 1000); // Reset progress after a short delay
    }
  };

  const handleVariantSubmit = async () => {
    try {
      let updatedVariant = { ...currentVariant };
      if (variantImageFile) {
        const uploadedImage = await handleVariantImageUpload(variantImageFile);
        if (uploadedImage) {
          updatedVariant.images = [uploadedImage, ...(updatedVariant.images || [])];
        }
      }
      await axios.post(`https://backend.gezeno.in/api/edit-product-variant/${currentVariant._id}`, updatedVariant);
      showNotification("Variant updated successfully");
      setShowVariantDialog(false);
      if (expandedProduct) {
        fetchProductVariants(expandedProduct);
      }
    } catch (error) {
      console.error('Error updating variant:', error);
      showNotification("Failed to update variant", 'error');
    }
  }

  const renderProductRow = (product) => (
    <React.Fragment key={product._id}>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-15 h-15 relative">
              <img
                src={product.images[0]?.url || '/placeholder.svg'}
                alt={product.name}
                width={50}
                height={50}
                className="rounded-md object-cover"
              />
            </div>
            <div>
              {product.name}
            </div>
          </div>
        </TableCell>
        <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</TableCell>
        <TableCell className="hidden sm:table-cell">{product.category?.name}</TableCell>
        <TableCell className="hidden sm:table-cell">{product.subCategory?.[0]?.name}</TableCell>
        <TableCell className="hidden sm:table-cell">{product.brand?.name}</TableCell>
        <TableCell className="hidden sm:table-cell">{product.stock}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product._id)}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
            <Button variant="outline" size="sm" onClick={() => toggleProductExpansion(product._id)}>
              {expandedProduct === product._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expandedProduct === product._id && (
        <TableRow>
          <TableCell colSpan={7}>
            <div className="p-4 bg-gray-50">
              <h4 className="font-semibold mb-2">Variants</h4>
              {productVariants[product._id] && productVariants[product._id].length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {productVariants[product._id].map((variant) => (
                    <Card key={variant._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold">{variant.variantName}</h5>
                            <p>Price: ${variant.variantPrice}</p>
                            <p>Stock: {variant.availableStock}</p>
                            {variant.sizes && variant.sizes.length > 0 && (
                              <p>Sizes: {variant.sizes.join(', ')}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditVariant(variant)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteVariant(variant._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {variant.images && variant.images.length > 0 && (
                          <img
                            src={variant.images[0].url || '/placeholder.svg'}
                            alt={variant.variantName}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No variants available for this product.</p>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      {notification && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className="mb-4">
          <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => {
          resetProductForm()
          setShowProductDialog(true)
        }} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 mr-2"
            />
            <Button type="submit" size="sm">Search</Button>
          </form>
          <Button variant="outline" size="sm" onClick={sortByPrice} className="w-full sm:w-auto">
            Sort Price {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        {filteredProducts.length === 0 ? (
          <div className="p-4 text-center">No Products found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Subcategory</TableHead>
                  <TableHead className="hidden sm:table-cell">Brand</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(renderProductRow)}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name *</Label>
                  <div className="col-span-3">
                    <Input 
                      id="name" 
                      name="name" 
                      value={currentProduct.name} 
                      onChange={handleInputChange} 
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price *</Label>
                  <div className="col-span-3">
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      value={currentProduct.price} 
                      onChange={handleInputChange} 
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discountedPrice" className="text-right">Discounted Price</Label>
                  <Input id="discountedPrice" name="discountedPrice" type="number" value={currentProduct.discountedPrice} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">Stock *</Label>
                  <div className="col-span-3">
                    <Input 
                      id="stock" 
                      name="stock" 
                      type="number" 
                      value={currentProduct.stock} 
                      onChange={handleInputChange} 
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category *</Label>
                  <div className="col-span-3">
                    <Select 
                      value={currentProduct.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subCategory" className="text-right">Subcategory</Label>
                  <Select
                    value={currentProduct.subCategory}
                    onValueChange={handleSubCategoryChange}
                    disabled={!currentProduct.category}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.find(cat => cat._id === currentProduct.category)?.subCategories?.map((subCategory) => (
                        <SelectItem key={subCategory._id} value={subCategory._id}>{subCategory.name}</SelectItem>
                      )) || []}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subSubCategory" className="text-right">Sub-subcategory</Label>
                  <Select
                    value={currentProduct.subSubCategory}
                    onValueChange={handleSubSubCategoryChange}
                    disabled={!currentProduct.subCategory || categories
                      .find(cat => cat._id === currentProduct.category)
                      ?.subCategories.find(subCat => subCat._id === currentProduct.subCategory)
                      ?.subSubCategories.length === 0}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select sub-subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .find(cat => cat._id === currentProduct.category)
                        ?.subCategories.find(subCat => subCat._id === currentProduct.subCategory)
                        ?.subSubCategories.map((subSubCategory) => (
                          <SelectItem key={subSubCategory._id} value={subSubCategory._id}>{subSubCategory.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subSubSubCategory" className="text-right">Sub-sub-subcategory</Label>
                  <Select
                    value={currentProduct.subSubSubCategory}
                    onValueChange={handleSubSubSubCategoryChange}
                    disabled={!currentProduct.subSubCategory || categories
                      .find(cat => cat._id === currentProduct.category)
                      ?.subCategories.find(subCat => subCat._id === currentProduct.subCategory)
                      ?.subSubCategories.find(subSubCat => subSubCat._id === currentProduct.subSubCategory)
                      ?.subSubSubCategories.length === 0}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select sub-sub-subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .find(cat => cat._id === currentProduct.category)
                        ?.subCategories.find(subCat => subCat._id === currentProduct.subCategory)
                        ?.subSubCategories.find(subSubCat => subSubCat._id === currentProduct.subSubCategory)
                        ?.subSubSubCategories.map((subSubSubCategory) => (
                          <SelectItem key={subSubSubCategory._id} value={subSubSubCategory._id}>{subSubSubCategory.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brand" className="text-right">Brand</Label>
                  <Select
                    value={currentProduct.brand}
                    onValueChange={(value) => setCurrentProduct(prev => ({ ...prev, brand: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ratings" className="text-right">Ratings</Label>
                  <Input id="ratings" name="ratings" type="number" min="0" max="5" step="0.1" value={currentProduct.ratings} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isActive" className="text-right">Active</Label>
                  <div className="col-span-3">
                    <Checkbox
                      id="isActive"
                      checked={currentProduct.isActive}
                      onCheckedChange={(checked) => setCurrentProduct(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filters" className="text-right">Filters</Label>
                  <div className="col-span-3">
                    <Select
                      value={currentProduct.filters.filter || ''}
                      onValueChange={handleFilterChange}
                    >
                      <SelectTrigger>
                        <SelectValue>
                        {filters.find(f => f._id === currentProduct.filters.filter)?.name || 'Select a filter'}
                          </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {filters.map((filter) => (
                          <SelectItem key={filter._id} value={filter._id}>{filter.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  </div>
                
                
              </div>
              {selectedTags.length > 0 && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Tags</Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <label key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          checked={currentProduct.filters?.tags?.includes(tag)} // Ensure this correctly checks if tag is selected
                          onCheckedChange={() => handleTagChange(tag)} // Call to toggle tag selection
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              
            </TabsContent>
            <TabsContent value="description">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortDetails" className="text-right">Short Details</Label>
                  <Textarea id="shortDetails" name="shortDetails" value={currentProduct.shortDetails} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right">Description *</Label>
                  <div className="col-span-3">
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={currentProduct.description} 
                      onChange={handleInputChange} 
                      className={`h-32 ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="productSpecs" className="text-right">Product Specs</Label>
                  <Textarea id="productSpecs" name="productSpecs" value={currentProduct.productSpecs} onChange={handleInputChange} className="col-span-3 h-32" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="images">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="images" className="text-right">Images</Label>
                  <div className="col-span-3">
                    <Input id="images" type="file" multiple onChange={handleImageUpload} />
                    {isUploading && (
                      <div className="mt-2">
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-4">
                  <ScrollArea className="h-72 w-full rounded-md border">
                    <div className="p-4">
                      <h4 className="mb-4 text-sm font-medium leading-none">Uploaded Images</h4>
                      {currentProduct.images.length === 0 ? (
                        <p className="text-sm text-gray-500">No images uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          {currentProduct.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img src={image.url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="seo">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="metatitle" className="text-right">Meta Title</Label>
                  <Input id="metatitle" name="metatitle" value={currentProduct.metatitle} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="metakeyword" className="text-right">Meta Keywords</Label>
                  <Input id="metakeyword" name="metakeyword" value={currentProduct.metakeyword} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="metadescription" className="text-right">Meta Description</Label>
                  <Textarea id="metadescription" name="metadescription" value={currentProduct.metadescription} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="metascript" className="text-right">Meta Script</Label>
                  <Textarea id="metascript" name="metascript" value={currentProduct.metascript} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={() => setShowProductDialog(false)} variant="outline">Cancel</Button>
            <Button onClick={handleProductSubmit}>{isEditing ? 'Update Product' : 'Add Product'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
          </DialogHeader>
          {currentVariant && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variantName" className="text-right">Variant Name</Label>
                <Input
                  id="variantName"
                  value={currentVariant.variantName}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, variantName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variantPrice" className="text-right">Price</Label>
                <Input
                  id="variantPrice"
                  type="number"
                  value={currentVariant.variantPrice}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, variantPrice: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="availableStock" className="text-right">Stock</Label>
                <Input
                  id="availableStock"
                  type="number"
                  value={currentVariant.availableStock}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, availableStock: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variantImage" className="text-right">Image</Label>
                <div className="col-span-3">
                  <Input
                    id="variantImage"
                    type="file"
                    onChange={(e) => setVariantImageFile(e.target.files[0])}
                    className="mb-2"
                  />
                  {isUploading && (
                    <div className="w-full">
                      <Progress value={variantUploadProgress} className="w-full" />
                      <p className="text-sm text-gray-500 mt-1">Uploading: {variantUploadProgress}%</p>
                    </div>
                  )}
                </div>
              </div>
              {currentVariant.images && currentVariant.images.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Current Image</Label>
                  <div className="col-span-3">
                    <img
                      src={currentVariant.images[0].url}
                      alt={currentVariant.variantName}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={() => setShowVariantDialog(false)} variant="outline">Cancel</Button>
            <Button onClick={handleVariantSubmit}>Update Variant</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 