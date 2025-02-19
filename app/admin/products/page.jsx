'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Trash2, Edit2, X, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Flashlight } from 'lucide-react'
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
  const [filters, setFilters] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const [expandedVariants, setExpandedVariants] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null)
  const [showVariantDialog, setShowVariantDialog] = useState(false)

  const [variantImageUploading, setVariantImageUploading] = useState(false)
  const [variantUploadProgress, setVariantUploadProgress] = useState(0)
  const [Sizes, setSizes] = useState([])

  const [selectedSizeTags, setSelectedSizeTags] = useState([])
  const [variantSelectedSizeTags, setVariantSelectedSizeTags] = useState([])
  const [variantSelectedTags, setVariantSelectedTags] = useState([])

  const [variantFormData, setVariantFormData] = useState({
    variantName: '',
    availableStock: '',
    maxQtyPerOrder: '',
    variantPrice: '',
    sizes: [],
    images: [],
    customFields: [],
    filters: []
  })

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
    filters: [],
    sizes: []
  })

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const [productsRes, categoriesRes, brandsRes, filtersRes, sizesRes] = await Promise.all([
          axios.get('https://backend.gezeno.in/api/getProducts'),
          axios.get('https://backend.gezeno.in/api/getCategories'),
          axios.get('https://backend.gezeno.in/api/getallbrands'),
          axios.get('https://backend.gezeno.in/api/filters'),
          axios.get('https://backend.gezeno.in/api/sizes')
        ])
        // console.log("this is product res data",productsRes.data)
        setProducts(productsRes.data)
        setFilteredProducts(productsRes.data)
        setCategories(categoriesRes.data)
        setBrands(brandsRes.data.data)
        setFilters(filtersRes.data.filters)
        // console.log("these are the filters",filtersRes.data.filters)
        setTags(filtersRes.data.filters)
        setSizes(sizesRes.data.sizes)
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
    console.log("this is the editing product",product)
    setCurrentProduct({
      ...product, 
      category: product.category?._id || '',
      subCategory: product.subCategory?.[0]?._id || '',
      subSubCategory: product.subSubCategory?.[0]?._id || '',
      subSubSubCategory: product.subSubSubCategory?.[0]?._id || '',
      brand: product.brand?._id || '',
      filters: product.filters || [],
      sizes: product.sizes || [],
    })
    
    if (product.filters && product.filters.length > 0) {
      const selectedFilters = product.filters.map(filter => ({
        filter: filters.find(f => f?._id === filter?.filter?._id),
        tags: filter.tags
      }))
      console.log("selected fiulter",selectedFilters)
      setCurrentProduct(prev => ({ ...prev, filters: selectedFilters }))
    } else {
      setCurrentProduct(prev => ({ ...prev, filters: [] }))
    }

    if (product.sizes && product.sizes.length>0) {
      const selectedSizes = product.sizes.map(size => ({
        size: Sizes.find(s => s?._id === size?.size?._id),
        tags: size.tags
      }))
      setCurrentProduct(prev => ({ ...prev, sizes: selectedSizes }))
      console.log("these are selected sizes",selectedSizes)
    } else {
      setSelectedSizeTags([]);
    }
    
    setIsEditing(true);
    setShowProductDialog(true);
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

  const handleSizeChange = (selectedSizeId) => {
    if (selectedSizeId === "no-size") {
      setCurrentProduct(prev => ({ ...prev, sizes: null }))
      setSelectedSizeTags([])
    } else {
      const selectedSize = Sizes.find(size => size._id === selectedSizeId);
      setCurrentProduct(prev => ({
        ...prev,
        sizes: {
          size: selectedSize,
          tags: []
        }
      }))
      setSelectedSizeTags(selectedSize?.tags || [])
    }
  }

  const handleSizeTagChange = (selectedSizeId) => {
    const SizeObject = Sizes.find((size) => size._id === selectedSizeId)
    if (!SizeObject) return
  
    setCurrentProduct((prev) => ({
      ...prev,
      sizes: Array.isArray(prev.sizes)
        ? [...prev.sizes, { size: SizeObject, tags: [] }]
        : [{ size: SizeObject, tags: [] }],
    }))
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
    if (product.stock === undefined || product.stock === null || product.stock < 0) newErrors.stock = "Valid stock quantity is required"
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

      let productResponse
      if (isEditing) {
        productResponse = await axios.post(`https://backend.gezeno.in/api/update-product/${currentProduct._id}`, productData)
      } else {
        productResponse = await axios.post('https://backend.gezeno.in/api/createProduct', productData)
      }

      if (variantFormData.variantName) {
        const variantPayload = {
          productId: isEditing ? currentProduct._id : productResponse.data.product._id,
          variantName: variantFormData.variantName,
          variantPrice: parseFloat(variantFormData.variantPrice),
          sizes: variantFormData.sizes,
          images: variantFormData.images,
          customFields: variantFormData.customFields.reduce((acc, field) => {
            if (field.name && field.value) {
              acc[field.name] = field.value
            }
            return acc
          }, {}),
          availableStock: parseInt(variantFormData.availableStock),
          maxQtyPerOrder: parseInt(variantFormData.maxQtyPerOrder),
          productSellingPrice: parseFloat(currentProduct.price),
          filters: variantFormData.filters
        }

        try {
          await axios.post('https://backend.gezeno.in/api/create-product-variant', variantPayload)
          showNotification("Product and variant created successfully")
        } catch (variantError) {
          console.error('Error creating variant:', variantError)
          showNotification("Product created but failed to create variant", 'error')
        }
      } else {
        showNotification(isEditing ? "Product updated successfully" : "Product created successfully")
      }

      const updatedProducts = await axios.get('https://backend.gezeno.in/api/getProducts')
      setProducts(updatedProducts.data)
      setFilteredProducts(updatedProducts.data)
      
      setShowProductDialog(false)
      resetProductForm()
      resetVariantForm()

    } catch (err) {
      console.error('Error submitting product:', err)
      showNotification(
        err.response?.data?.message || 
        (isEditing ? "Failed to update product" : "Failed to create product"), 
        'error'
      )
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
      filters: [],
      sizes: null
    })
    setIsEditing(false)
    setErrors({})
  }

  const resetVariantForm = () => {
    setVariantFormData({
      variantName: '',
      availableStock: '',
      maxQtyPerOrder: '',
      variantPrice: '',
      sizes: [],
      images: [],
      customFields: [],
      filters: []
    })
    setVariantImageUploading(false)
    setVariantUploadProgress(0)
    setVariantSelectedTags([])
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

  const handleFilterChange = (selectedFilterId) => {
    const filterObject = filters.find((filter) => filter._id === selectedFilterId);
    if (!filterObject) return;

    setCurrentProduct(prev => ({
      ...prev,
      filters: [...prev.filters, { filter: filterObject, tags: [] }]
    }));
  };

  const handleTagChange = (filterId, tag) => {
    setCurrentProduct(prev => ({
      ...prev,
      filters: prev.filters.map(filter => 
        filter.filter._id === filterId
          ? { 
              ...filter, 
              tags: filter.tags.includes(tag)
                ? filter.tags.filter(t => t !== tag)
                : [...filter.tags, tag]
            }
          : filter
      )
    }));
  };
  const handleTagChangeOfSize = (sizeId, tag) => {
    setCurrentProduct(prev => ({
      ...prev,
      sizes: prev.sizes.map(size => 
        size.size._id === sizeId
          ? { 
              ...size, 
              tags: size.tags.includes(tag)
                ? size.tags.filter(t => t !== tag)
                : [...size.tags, tag]
            }
          : size
      )
    }));
  };

  const handleRemoveFilter = (filterId) => {
    setCurrentProduct(prev => ({
      ...prev,
      filters: prev.filters.filter(filter => filter.filter._id !== filterId)
    }));
  };
  const handleRemoveSize = (sizeId) => {
    setCurrentProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size.size._id !== sizeId)
    }));
  };

  const fetchVariants = async (productId) => {
    if (expandedVariants === productId) {
      setExpandedVariants(null);
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get(`https://backend.gezeno.in/api/get-product-variants/${productId}`);
      const updatedProducts = products.map(product => {
        if (product._id === productId) {
          return { ...product, variants: response.data.data || [] };
        }
        return product;
      });
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setExpandedVariants(productId);
      if (response.data.message === "No variants found for this product") {
        setError('No variants found for this product');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching variants:', err);
      setError('Failed to fetch variants');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant)
    setShowVariantDialog(true)
  }

  const handleVariantInputChange = (e) => {
    const { name, value } = e.target
    setVariantFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVariantFilterChange = (selectedFilterId) => {
    const filterObject = filters.find((filter) => filter._id === selectedFilterId);
    if (!filterObject) return;

    setVariantFormData(prev => ({
      ...prev,
      filters: [...prev.filters, { filter: filterObject, tags: [] }]
    }));
  };

  const handleVariantTagChange = (filterId, tag) => {
    setVariantFormData(prev => ({
      ...prev,
      filters: prev.filters.map(filter => 
        filter.filter._id === filterId
          ? { 
              ...filter, 
              tags: filter.tags.includes(tag)
                ? filter.tags.filter(t => t !== tag)
                : [...filter.tags, tag]
            }
          : filter
      )
    }));
  };

  const handleRemoveVariantFilter = (filterId) => {
    setVariantFormData(prev => ({
      ...prev,
      filters: prev.filters.filter(filter => filter.filter._id !== filterId)
    }));
  };

  const handleVariantSizeChange = (selectedSizeId) => {
    if (selectedSizeId === "no-size") {
      setVariantFormData(prev => ({ ...prev, sizes: [] }))
    } else {
      const selectedSize = Sizes.find(size => size._id === selectedSizeId);
      setVariantFormData(prev => ({
        ...prev,
        sizes: [{ size: selectedSize, tags: [] }]
      }))
    }
  };

  const handleVariantSizeTagChange = (sizeIndex, tag) => {
    setVariantFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, index) => 
        index === sizeIndex
          ? { 
              ...size, 
              tags: size.tags.includes(tag)
                ? size.tags.filter(t => t !== tag)
                : [...size.tags, tag]
            }
          : size
      )
    }));
  };

  const handleVariantImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    setVariantImageUploading(true)
    setVariantUploadProgress(0)
    
    try {
      const uploadPromises = files.map(async (file) => {
        const uploadUrlResponse = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`)
        const { url, filename } = uploadUrlResponse.data

        await axios.put(url, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setVariantUploadProgress(prev => Math.min(prev + (percentCompleted / files.length), 100))
          }
        })

        const previewResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`)
        
        return { url: previewResponse.data.url, filename }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      
      setVariantFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))

      showNotification(`Successfully uploaded ${uploadedImages.length} images`)
    } catch (error) {
      console.error('Error in variant image upload:', error)
      showNotification('Failed to process variant image uploads', 'error')  
    } finally {
      setVariantImageUploading(false)
      setVariantUploadProgress(0)
    }
  }

  const handleRemoveVariantImage = (imageIndex) => {
    setVariantFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }))
  }

  const handleAddVariant = async () => {
    try {
      setLoading(true)
      const variantPayload = {
        productId: currentProduct._id,
        variantName: variantFormData.variantName,
        variantPrice: parseFloat(variantFormData.variantPrice),
        sizes: variantFormData.sizes,
        images: variantFormData.images,
        customFields: variantFormData.customFields.reduce((acc, field) => {
          if (field.name && field.value) {
            acc[field.name] = field.value
          }
          return acc
        }, {}),
        availableStock: parseInt(variantFormData.availableStock),
        maxQtyPerOrder: parseInt(variantFormData.maxQtyPerOrder),
        productSellingPrice: parseFloat(currentProduct.price),
        filters: variantFormData.filters
      }

      const response = await axios.post('https://backend.gezeno.in/api/create-product-variant', variantPayload)
      showNotification("Variant added successfully")
      
      // Update the product's variants
      const updatedProduct = {
        ...currentProduct,
        variants: [...(currentProduct.variants || []), response.data.variant]
      }
      setCurrentProduct(updatedProduct)

      // Reset variant form
      setVariantFormData({
        variantName: '',
        availableStock: '',
        maxQtyPerOrder: '',
        variantPrice: '',
        sizes: [],
        images: [],
        customFields: [],
        filters: []
      })
    } catch (err) {
      console.error('Error adding variant:', err)
      showNotification(err.response?.data?.message || "Failed to add variant", 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVariantSubmit = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`https://backend.gezeno.in/api/edit-product-variant/${editingVariant._id}`, {
        variantName: editingVariant.variantName,
        variantPrice: editingVariant.variantPrice,
        sizes: editingVariant.sizes,
        images: editingVariant.images,
        customFields: editingVariant.customFields,
        availableStock: editingVariant.availableStock,
        maxQtyPerOrder: editingVariant.maxQtyPerOrder
      })

      const updatedVariant = response.data.variant

      const updatedProducts = products.map(product => {
        if (product._id === updatedVariant.productId) {
          const updatedVariants = product.variants.map(v => 
            v._id === updatedVariant._id ? updatedVariant : v
          )
          return { ...product, variants: updatedVariants }
        }
        return product
      })

      setProducts(updatedProducts)
      setFilteredProducts(updatedProducts)
      setShowVariantDialog(false)
      showNotification("Variant updated successfully")
    } catch (err) {
      console.error('Error updating variant:', err)
      showNotification(err.response?.data?.message || "Failed to update variant", 'error')
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{
    console.log("this is the current product",currentProduct)
  },[handleEditProduct])

  const handleDeleteVariant = async (variantId, productId) => {
    try {
      setLoading(true)
      const response = await axios.post(`https://backend.gezeno.in/api/delete-product-variant/${variantId}`)
      if (response.status === 200) {
        const updatedProducts = products.map(product => {
          if (product._id === productId) {
            return { ...product, variants: product.variants.filter(v => v._id !== variantId) }
          }
          return product
        })
        setProducts(updatedProducts)
        setFilteredProducts(updatedProducts)
        toast.success(response.data.message || "Variant deleted successfully")
      }
    } catch (err) {
      console.error('Error deleting variant:', err)
      toast.error(err.response?.data?.message || "Failed to delete variant")
    } finally {
      setLoading(false)
    }
  }

  const renderProductRow = (product) => {
    return (
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
                {product.name.slice(0,100)} ...
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchVariants(product._id)}
              >
                {expandedVariants === product._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {expandedVariants === product._id && (
          <TableRow>
            <TableCell colSpan={7}>
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-semibold mb-2">Variants</h4>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading variants...</span>
                  </div>
                ) : error ? (
                  <div className="text-amber-500">{error}</div>
                ) : product.variants && product.variants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {product.variants.map((variant) => (
                      <Card key={variant._id}>
                        <CardContent className="p-4">
                          <h5 className="font-semibold">{variant.variantName}</h5>
                          <img src={variant.images[0]?.url} alt={variant.variantName} className="w-full h-32 object-cover rounded-md my-2" />
                          <p>Price: ${variant.variantPrice.toFixed(2)}</p>
                          <p>Stock: {variant.availableStock}</p>
                          {variant.sizes && variant.sizes.length > 0 && (
                            <p>Sizes: {variant.sizes.join(', ')}</p>
                          )}
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditVariant(variant)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteVariant(variant._id, product._id)}>Delete</Button>
                          </div>
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
    );
  };

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
    <div className="h-screen flex flex-col">
      <Toaster position="top-right" />
      {notification && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className="mb-4">
          <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex-none p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button onClick={() => {
            resetProductForm()
            resetVariantForm()
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
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4">
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
        </div>
      </ScrollArea>
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">  
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general" className="flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              {/* <TabsTrigger value="variants">Variants</TabsTrigger> */}
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList> 
            <ScrollArea className="h-[calc(90vh-8rem)]">
            <div className="px-6 py-4">
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
                  <Select name="brand" value={currentProduct.brand} onValueChange={(value) => handleInputChange({ target: { name: 'brand', value } })}>
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
                  <Input id="ratings" name="ratings" type="number" step="0.1" min="0" max="5" value={currentProduct.ratings} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isActive" className="text-right">Active</Label>
                  <Checkbox
                    id="isActive"
                    checked={currentProduct.isActive}
                    onCheckedChange={(checked) => setCurrentProduct(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Filters</Label>
                  <div className="col-span-3 space-y-4">
                    {currentProduct.filters.map((filter, index) => (
                      <div key={filter.filter?._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{filter.filter?.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFilter(filter.filter?._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filter.filter?.tags.map((tag) => (
                            <label key={tag} className="flex items-center space-x-2">
                              <Checkbox
                                checked={filter.tags.includes(tag)}
                                onCheckedChange={() => handleTagChange(filter.filter?._id, tag)}
                              />
                              <span>{tag}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Select onValueChange={handleFilterChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a filter" />
                      </SelectTrigger>
                      <SelectContent>
                        {filters
                          .filter(filter => !currentProduct.filters.some(f => f.filter?._id === filter?._id))
                          .map((filter) => (
                            <SelectItem key={filter?._id} value={filter?._id}>
                              {filter?.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sizes" className="text-right">Sizes</Label>
                    <div className="col-span-3">
                    {currentProduct.sizes?.map((size, index) => (
                      <div key={size.size?._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{size.size?.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSize(size.size?._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {size.size?.tags.map((tag) => (
                            <label key={tag} className="flex items-center space-x-2">
                              <Checkbox
                                checked={size.tags.includes(tag)}
                                onCheckedChange={() => handleTagChangeOfSize(size.size?._id, tag)}
                              />
                              <span>{tag}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                  {/* {currentProduct.sizes && (
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right">Tags</Label>
                      <div className="col-span-3 flex flex-wrap gap-2">
                        {selectedSizeTags?.map((tag) => (
                          <label key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              checked={currentProduct.sizes?.tags?.includes(tag)}
                              onCheckedChange={() => handleSizeTagChange(tag)}
                            />
                            <span>{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )} */}
                   <Select onValueChange={handleSizeTagChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a size" />
                      </SelectTrigger>
                      <SelectContent>
                        {Sizes
                          .filter(size => !currentProduct?.sizes?.some(s => s.size?._id === size?._id))
                          .map((size) => (
                            <SelectItem key={size?._id} value={size?._id}>
                              {size?.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                </div>
               
              </div>
            </TabsContent>
            {/* <TabsContent value="variants">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>VARIANT DETAILS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="variantName">Variant Name</Label>
                          <Input
                            id="variantName"
                            name="variantName"
                            value={variantFormData.variantName}
                            onChange={handleVariantInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="variantPrice">Variant Price</Label>
                          <Input
                            id="variantPrice"
                            name="variantPrice"
                            type="number"
                            value={variantFormData.variantPrice}
                            onChange={handleVariantInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="availableStock">Available Stock</Label>
                          <Input
                            id="availableStock"
                            name="availableStock"
                            type="number"
                            value={variantFormData.availableStock}
                            onChange={handleVariantInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxQtyPerOrder">Max Quantity Per Order</Label>
                          <Input
                            id="maxQtyPerOrder"
                            name="maxQtyPerOrder"
                            type="number"
                            value={variantFormData.maxQtyPerOrder}
                            onChange={handleVariantInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Variant Filters</Label>
                        <div className="space-y-4 mt-2">
                          {variantFormData.filters.map((filter, index) => (
                            <div key={filter.filter?._id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{filter.filter?.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveVariantFilter(filter.filter?._id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {filter.filter?.tags.map((tag) => (
                                  <label key={tag} className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={filter.tags.includes(tag)}
                                      onCheckedChange={() => handleVariantTagChange(filter.filter?._id, tag)}
                                    />
                                    <span>{tag}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Select onValueChange={handleVariantFilterChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add a filter" />
                            </SelectTrigger>
                            <SelectContent>
                              {filters
                                .filter(filter => !variantFormData.filters.some(f => f.filter?._id === filter?._id))
                                .map((filter) => (
                                  <SelectItem key={filter?._id} value={filter?._id}>
                                    {filter?.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Variant Sizes</Label>
                        <div className="space-y-4 mt-2">
                          <Select
                            value={variantFormData.sizes[0]?.size?._id || "no-size"}
                            onValueChange={handleVariantSizeChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a size">
                                {variantFormData.sizes[0]?.size
                                  ? Sizes.find(s => s._id === variantFormData.sizes[0].size._id)?.name
                                  : 'No size'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no-size">No size</SelectItem>
                              {Sizes.map((size) => (
                                <SelectItem key={size._id} value={size._id}>{size.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {variantFormData.sizes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {Sizes.find(s => s._id === variantFormData.sizes[0].size._id)?.tags.map((tag) => (
                                <label key={tag} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={variantFormData.sizes[0].tags.includes(tag)}
                                    onCheckedChange={() => handleVariantSizeTagChange(0, tag)}
                                  />
                                  <span>{tag}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="variantImages">Variant Images</Label>
                        <Input
                          id="variantImages"
                          type="file"
                          multiple
                          onChange={handleVariantImageUpload}
                          accept="image/*"
                        />
                        {variantImageUploading && (
                          <div className="mt-2">
                            <progress value={variantUploadProgress} max="100" className="w-full" />
                            <p className="text-sm text-gray-500 mt-1">Uploading: {variantUploadProgress.toFixed(0)}%</p>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {variantFormData.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image.url}
                                alt={`Variant image ${index + 1}`}
                                width={100}
                                height={100}
                                className="rounded-md object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-0 right-0"
                                onClick={() => handleRemoveVariantImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Custom Fields</Label>
                        {variantFormData.customFields.map((field, index) => (
                          <div key={index} className="flex items-center space-x-2 mt-2">
                            <Input
                              placeholder="Field name"
                              value={field.name}
                              onChange={(e) => {
                                const newCustomFields = [...variantFormData.customFields];
                                newCustomFields[index].name = e.target.value;
                                setVariantFormData(prev => ({ ...prev, customFields: newCustomFields }));
                              }}
                            />
                            <Input
                              placeholder="Field value"
                              value={field.value}
                              onChange={(e) => {
                                const newCustomFields = [...variantFormData.customFields];
                                newCustomFields[index].value = e.target.value;
                                setVariantFormData(prev => ({ ...prev, customFields: newCustomFields }));
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newCustomFields = variantFormData.customFields.filter((_, i) => i !== index);
                                setVariantFormData(prev => ({ ...prev, customFields: newCustomFields }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVariantFormData(prev => ({
                              ...prev,
                              customFields: [...prev.customFields, { name: '', value: '' }]
                            }));
                          }}
                          className="mt-2"
                        >
                          Add Custom Field
                        </Button>
                      </div>
                      
                      <Button onClick={handleAddVariant} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Variant'}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent> */}
                <TabsContent value="description">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortDetails" className="text-right">Short Details</Label>
                  <Textarea id="shortDetails" name="shortDetails" value={currentProduct.shortDetails} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description *</Label>
                  <div className="col-span-3">
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={currentProduct.description} 
                      onChange={handleInputChange} 
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productSpecs" className="text-right">Product Specs</Label>
                  <Textarea id="productSpecs" name="productSpecs" value={currentProduct.productSpecs} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="images">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="images" className="text-right">Images</Label>
                  <div className="col-span-3">
                    <Input id="images" type="file" multiple onChange={handleImageUpload} accept="image/*" />
                    {isUploading && (
                      <div className="mt-2">
                        <progress value={uploadProgress} max="100" className="w-full" />
                        <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress.toFixed(0)}%</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-4">
                  <ScrollArea className="h-72 w-full rounded-md border p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {currentProduct.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="metadescription" className="text-right">Meta Description</Label>
                  <Textarea id="metadescription" name="metadescription" value={currentProduct.metadescription} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="metascript" className="text-right">Meta Script</Label>
                  <Textarea id="metascript" name="metascript" value={currentProduct.metascript} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>
            </TabsContent>
            <div className="mt-5 flex justify-end space-x-2">
              <Button onClick={() => setShowProductDialog(false)} variant="outline">Cancel</Button>
              <Button onClick={handleProductSubmit}>{isEditing ? 'Update Product' : 'Add Product'}</Button>
            </div>
          </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
    <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variantName" className="text-right">Name</Label>
            <Input
              id="variantName"
              name="variantName"
              value={editingVariant?.variantName || ''}
              onChange={handleVariantInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variantPrice" className="text-right">Price</Label>
            <Input
              id="variantPrice"
              name="variantPrice"
              type="number"
              value={editingVariant?.variantPrice || ''}
              onChange={handleVariantInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availableStock" className="text-right">Stock</Label>
            <Input
              id="availableStock"
              name="availableStock"
              type="number"
              value={editingVariant?.availableStock || ''}
              onChange={handleVariantInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sizes" className="text-right">Sizes</Label>
            <Input
              id="sizes"
              name="sizes"
              value={editingVariant?.sizes?.tags?.join(', ') || ''}
              onChange={(e) => handleVariantInputChange({
                target: {
                  name: 'sizes',
                  value: e.target.value.split(',').map(size => size.trim())
                }
              })}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={() => setShowVariantDialog(false)} variant="outline">Cancel</Button>
          <Button onClick={handleVariantSubmit}>Update Variant</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  )
}

