"use client"

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Trash2, Edit2, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from 'react-hot-toast'
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showNewProductDialog, setShowNewProductDialog] = useState(false)
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentProductForVariant, setCurrentProductForVariant] = useState(null)
  const [currentProductForEdit, setCurrentProductForEdit] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    shortDetails: '',
    productSpecs: '',
    images: [],
    category: '',
    brand: '',
    stock: ''
  })
  const [newVariants, setNewVariants] = useState([{
    variantName: '',
    variantPrice: '',
    sizes: [],
    images: []
  }])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL','28','30','32']

  useEffect(() => {
    fetchProducts()
    fetchCategoriesAndBrands()
  }, [])

  
  useEffect(() => {
    handleSearch()
  }, [searchQuery, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://backend.gezeno.com/api/getproducts')
      setProducts(response.data)
      setFilteredProducts(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch products')
      setLoading(false)
      toast.error('Failed to fetch products')
    }
  }

  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        axios.get('https://backend.gezeno.com/api/categories'),
        axios.get('https://backend.gezeno.com/api/getallbrands')
      ])
      setCategories(categoriesResponse.data.categories)
      setBrands(brandsResponse.data.data)
    } catch (err) {
      console.error('Failed to fetch categories or brands:', err)
      toast.error('Failed to fetch categories or brands')
    }
  }

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      (product.description && product.description.toLowerCase().includes(lowercasedQuery)) ||
      (product.category && product.category.name && product.category.name.toLowerCase().includes(lowercasedQuery)) ||
      (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(lowercasedQuery))
    )
    setFilteredProducts(filtered)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch()
    if (filteredProducts.length === 0) {
      toast.error("No products found. Try a different search term.")
    }
  }

  const SafeRender = ({ value }) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return 'N/A';
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.com/api/deleteproduct/${id}`)
      await fetchProducts()
      toast.success("Product deleted successfully")
    } catch (err) {
      setError('Failed to delete product')
      toast.error("Failed to delete product. Please try again.")
    }
  }


  const handleEditProduct = (product) => {
    setCurrentProductForEdit(product)
    setShowEditDialog(true)
  }

  const handleAddVariant = (product) => {
    setCurrentProductForVariant(product)
    setNewVariants([{
      variantName: '',
      variantPrice: '',
      sizes: [],
      images: []
    }])
    setShowVariantDialog(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(value)
    setNewProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleVariantInputChange = (index, e) => {
    const { name, value } = e.target
    setNewVariants(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [name]: value }
      return updated
    })
  }

  const handleVariantSizeChange = (index, size) => {
    setNewVariants(prev => {
      // Create a deep copy of the previous state
      const updated = prev.map(variant => ({...variant}));
      
      // Create a new Set from the existing sizes
      const sizes = new Set(updated[index].sizes);
      
      // Toggle the size
      if (sizes.has(size)) {
        sizes.delete(size);
      } else {
        sizes.add(size);
      }
      
      // Update the variant with the new sizes array
      updated[index] = {
        ...updated[index],
        sizes: Array.from(sizes)
      };
      
      return updated;
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setCurrentProductForEdit(prev => ({ ...prev, [name]: value }))
  }

  const removeDuplicateImages = (images) => {
    const uniqueUrls = new Set();
    return images.filter(img => {
      if (uniqueUrls.has(img.url)) {
        return false;
      }
      uniqueUrls.add(img.url);
      return true;
    });
  };
  

  
    const handleImageUpload = async (e, index = null) => {
      const files = Array.from(e.target.files);
      setIsUploading(true)
      setUploadProgress(0)
      
      try {
        const uploadPromises = files.map(async (file, fileIndex) => {
          try {
            const response = await axios.get(`https://backend.gezeno.com/api/imageUpload/${file.name}`);
            const { url, filename } = response.data;
  
            await axios.put(url, file, {
              headers: { 
                'Content-Type': file.type || 'image/jpeg',
                'Content-Length': file.size
              },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`${filename} upload progress: ${percentCompleted}%`);
                setUploadProgress(prev => Math.min(prev + (percentCompleted / files.length), 100))
              }
            });
  
            const imageUrlResponse = await axios.get(`https://backend.gezeno.com/api/image/${filename}`);
            const imageUrl = imageUrlResponse.data.url;
  
            return { url: imageUrl, filename: filename };
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            toast.error(`Failed to upload ${file.name}`);
            return null;
          }
        });
  
        const uploadedImages = await Promise.all(uploadPromises);
  
        const successfulUploads = uploadedImages.filter(image => image !== null);
        
        if (index !== null) {
          setNewVariants(prev => {
            const updated = [...prev];
            updated[index].images = removeDuplicateImages([...updated[index].images, ...successfulUploads]);
            return updated;
          });
        } else {
          setNewProduct(prev => ({
            ...prev,
            images: removeDuplicateImages([...prev.images, ...successfulUploads])
          }));
        }
  
        toast.success(`Successfully uploaded ${successfulUploads.length} images`);
        
      } catch (error) {
        console.error('Error in batch upload:', error);
        toast.error('Failed to process image uploads');
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    };
  

  const handleRemoveImage = (imageIndex, variantIndex = null) => {
    if (variantIndex !== null) {
      setNewVariants(prev => {
        const updated = [...prev]
        updated[variantIndex].images = updated[variantIndex].images.filter((_, index) => index !== imageIndex)
        return updated
      })
    } else {
      setNewProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== imageIndex)
      }));
    }
  };

  const handleAddProduct = async () => {
    if (isUploading) {
      toast.error("Please wait for image upload to complete")
      return
    }
    try {
      setLoading(true)
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        reviews: [],
        images: newProduct.images
      }
      await axios.post('https://backend.gezeno.com/api/createproduct', productData)
      setShowNewProductDialog(false)
      await fetchProducts()
      toast.success("Product added successfully")
      setNewProduct({
        name: '',
        price: '',
        description: '',
        shortDetails: '',
        productSpecs: '',
        images: [],
        category: '',
        brand: '',
        stock: ''
      })
    } catch (err) {
      setError('Failed to add product')
      toast.error("Failed to add product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddVariantSubmit = async () => {
    try {
      setLoading(true)
      for (const variant of newVariants) {
        const variantData = {
          productId: currentProductForVariant._id,
          variantName: variant.variantName,
          variantPrice: parseFloat(variant.variantPrice),
          sizes: variant.sizes,
          images: variant.images
        }
        await axios.post('https://backend.gezeno.com/api/create-product-variant', variantData)
      }
      setShowVariantDialog(false)
      await fetchProducts()
      toast.success("Variants added successfully")
      setNewVariants([{
        variantName: '',
        variantPrice: '',
        sizes: [],
        images: []
      }])
    } catch (err) {
      console.log(err)
      setError('Failed to add variants')
      toast.error("Failed to add variants. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditProductSubmit = async () => {
    try {
      setLoading(true)
      const productData = {
        ...currentProductForEdit,
        price: parseFloat(currentProductForEdit.price),
        stock: parseInt(currentProductForEdit.stock, 10)
      }
      await axios.post(`https://backend.gezeno.com/api/updateproduct/${currentProductForEdit._id}`, productData)
      setShowEditDialog(false)
      await fetchProducts()
      toast.success("Product updated successfully")
    } catch (err) {
      setError('Failed to update product')
      toast.error("Failed to update product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const sortByPrice = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    setFilteredProducts(sortedProducts);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }

  const renderProductRow = (product) => (
    <TableRow key={product._id}>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 relative">
            <Image
              src={product.images[0]?.url || '/placeholder.svg'}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div>
            <SafeRender value={product.name} />
          </div>
        </div>
      </TableCell>
      <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</TableCell>
      <TableCell className="hidden sm:table-cell"><SafeRender value={product.category?.name} /></TableCell>
      <TableCell className="hidden sm:table-cell"><SafeRender value={product.brand?.name} /></TableCell>
      <TableCell className="hidden sm:table-cell"><SafeRender value={product.stock} /></TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddVariant(product)}>
            <Plus className="h-4 w-4 mr-1" /> Add Variant
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product._id)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="container  mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setShowNewProductDialog(true)} size="sm">
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
        {loading ? (
          <div className="p-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading products...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-4 text-center">No Products found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
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

      <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    name="category"
                    onValueChange={(value) => handleInputChange({ target: { name: 'category', value } })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brand" className="text-right">
                    Brand
                  </Label>
                  <Select
                    name="brand"
                    onValueChange={(value) => handleInputChange({ target: { name: 'brand', value } })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand._id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="description">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortDescription" className="text-right">
                    Short Description
                  </Label>
                  <Textarea
                    id="shortDetails"
                    name="shortDetails"
                    value={newProduct.shortDetails}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productSpecs" className="text-right">
                    Product Specs
                  </Label>
                  <Textarea
                    id="productSpecs"
                    name="productSpecs"
                    value={newProduct.productSpecs}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="images">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="images" className="text-right">
                    Product Images
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    onChange={handleImageUpload}
                    className="col-span-3"
                    multiple
                    disabled={isUploading}
                  />
                </div>
                {isUploading && (
                  <div className="col-span-4">
                    <progress value={uploadProgress} max="100" className="w-full" />
                    <p className="text-center">{Math.round(uploadProgress)}% Uploaded</p>
                  </div>
                )}
                {newProduct.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {newProduct.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Product image ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowNewProductDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProduct} disabled={isUploading || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isUploading ? 'Uploading...' : 'Add Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Variants for {currentProductForVariant?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] overflow-y-auto">
            {newVariants.map((variant, index) => (
              <div key={index} className="mb-8 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Variant {index + 1}</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`variantName-${index}`} className="text-right">
                      Variant Name
                    </Label>
                    <Input
                      id={`variantName-${index}`}
                      name="variantName"
                      value={variant.variantName}
                      onChange={(e) => handleVariantInputChange(index, e)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`variantPrice-${index}`} className="text-right">
                      Variant Price
                    </Label>
                    <Input
                      id={`variantPrice-${index}`}
                      name="variantPrice"
                      type="number"
                      value={variant.variantPrice}
                      onChange={(e) => handleVariantInputChange(index, e)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Sizes</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}-${variant.id}`}
                    checked={variant.sizes.includes(size)}
                    onCheckedChange={() => handleVariantSizeChange(index, size)}
                  />
                  <Label htmlFor={`size-${size}-${variant.id}`}>{size}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            Selected sizes: {variant.sizes.join(', ') || 'None'}
          </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`variantImages-${index}`} className="text-right">
                      Variant Images
                    </Label>
                    <Input
                      id={`variantImages-${index}`}
                      type="file"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="col-span-3"
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="col-span-4">
                      <progress value={uploadProgress} max="100" className="w-full" />
                      <p className="text-center">{Math.round(uploadProgress)}% Uploaded</p>
                    </div>
                  )}
                  {console.log(variant.images.length)}
                  {variant.images.length > 0 && (

                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {variant.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image.url}
                            alt={`Variant image ${imgIndex + 1}`}
                            width={100}
                            height={100}
                            className="object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-0 right-0"
                            onClick={() => handleRemoveImage(imgIndex, index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setNewVariants([...newVariants, { variantName: '', variantPrice: '', sizes: [], images: [] }])}
            >
              Add Another Variant
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowVariantDialog(false)}>Cancel</Button>
              <Button onClick={handleAddVariantSubmit} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Variants
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Product: {currentProductForEdit?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="editName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="editName"
                    name="name"
                    value={currentProductForEdit?.name || ''}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editPrice" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="editPrice"
                    name="price"
                    type="number"
                    value={currentProductForEdit?.price || ''}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editCategory" className="text-right">
                    Category
                  </Label>
                  <Select
                    name="category"
                    value={currentProductForEdit?.category?._id}
                    onValueChange={(value) => handleEditInputChange({ target: { name: 'category', value } })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editBrand" className="text-right">
                    Brand
                  </Label>
                  <Select
                    name="brand"
                    value={currentProductForEdit?.brand?._id}
                    onValueChange={(value) => handleEditInputChange({ target: { name: 'brand', value } })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editStock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="editStock"
                    name="stock"
                    type="number"
                    value={currentProductForEdit?.stock || ''}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="description">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editShortDescription" className="text-right">
                    Short Description
                  </Label>
                  <Textarea
                    id="editShortDetails"
                    name="shortDetails"
                    value={currentProductForEdit?.shortDetails || ''}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editDescription" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="editDescription"
                    name="description"
                    value={currentProductForEdit?.description || ''}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editProductSpecs" className="text-right">
                    Product Specs
                  </Label>
                  <Textarea
                    id="editProductSpecs"
                    name="product_specs"
                    value={currentProductForEdit?.product_specs ||""}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
                        </TabsContent>
            <TabsContent value="images">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editImages" className="text-right">
                    Product Images
                  </Label>
                  <Input
                    id="editImages"
                    type="file"
                    onChange={handleImageUpload}
                    className="col-span-3"
                    multiple
                    disabled={isUploading}
                  />
                </div>
                {isUploading && (
                  <div className="col-span-4">
                    <progress value={uploadProgress} max="100" className="w-full" />
                    <p className="text-center">{Math.round(uploadProgress)}% Uploaded</p>
                  </div>
                )}
                {currentProductForEdit?.images && currentProductForEdit.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {currentProductForEdit.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Product image ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={() => {
                            const updatedImages = currentProductForEdit.images.filter((_, i) => i !== index);
                            setCurrentProductForEdit(prev => ({ ...prev, images: updatedImages }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="variants">
              <ScrollArea className="h-[60vh] overflow-y-auto">
                {currentProductForEdit?.variants && currentProductForEdit.variants.length > 0 ? (
                  currentProductForEdit.variants.map((variant, index) => (
                    <div key={index} className="border p-4 rounded-md mb-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Variant Name</Label>
                        <Input
                          value={variant.variantName}
                          onChange={(e) => {
                            const updatedVariants = [...currentProductForEdit.variants];
                            updatedVariants[index].variantName = e.target.value;
                            setCurrentProductForEdit(prev => ({ ...prev, variants: updatedVariants }));
                          }}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4 mt-2">
                        <Label className="text-right">Variant Price</Label>
                        <Input
                          type="number"
                          value={variant.variantPrice}
                          onChange={(e) => {
                            const updatedVariants = [...currentProductForEdit.variants];
                            updatedVariants[index].variantPrice = parseFloat(e.target.value);
                            setCurrentProductForEdit(prev => ({ ...prev, variants: updatedVariants }));
                          }}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4 mt-2">
                        <Label className="text-right">Sizes</Label>
                        <div className="col-span-3 flex flex-wrap gap-2">
                          {sizeOptions.map((size) => (
                            <div key={size} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-size-${size}-${index}`}
                                checked={variant.sizes.includes(size)}
                                onCheckedChange={(checked) => {
                                  const updatedVariants = [...currentProductForEdit.variants];
                                  if (checked) {
                                    updatedVariants[index].sizes = [...updatedVariants[index].sizes, size];
                                  } else {
                                    updatedVariants[index].sizes = updatedVariants[index].sizes.filter(s => s !== size);
                                  }
                                  setCurrentProductForEdit(prev => ({ ...prev, variants: updatedVariants }));
                                }}
                              />
                              <Label htmlFor={`edit-size-${size}-${index}`}>{size}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No variants available for this product.</p>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditProductSubmit} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
