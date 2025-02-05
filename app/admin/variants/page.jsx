'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, Plus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Component() {
  const [formData, setFormData] = useState({
    productId: '',
    variantName: '',
    availableStock: '',
    maxQtyPerOrder: '',
    productSellingPrice: '',
    variantPrice: '',
    sizes: [],
    images: [],
    customFields: []
  })
  const [products, setProducts] = useState([])
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backend.gezeno.in/api/getProducts')
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
        setNotification({ type: 'error', message: 'Failed to fetch products. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProductSelect = (value) => {
    const product = products.find(p => p._id === value)
    setSelectedProduct(product)
    setFormData(prev => ({ 
      ...prev, 
      productId: value,
      productSellingPrice: product ? product.price.toString() : ''
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleAddCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { name: '', value: '' }]
    }))
  }

  const handleRemoveCustomField = (index) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }))
  }

  const handleCustomFieldChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', filename: '' }]
    }))
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleImageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const validateForm = () => {
    const requiredFields = ['productId', 'variantName', 'availableStock', 'maxQtyPerOrder', 'productSellingPrice', 'variantPrice']
    for (const field of requiredFields) {
      if (!formData[field]) {
        setNotification({ type: 'error', message: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.` })
        return false
      }
    }
    if (formData.sizes.length === 0) {
      setNotification({ type: 'error', message: 'Please select at least one size.' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const customFieldsObject = formData.customFields.reduce((acc, field) => {
      if (field.name && field.value) {
        acc[field.name] = field.value
      }
      return acc
    }, {})

    const payload = {
      ...formData,
      customFields: customFieldsObject,
      variantPrice: parseFloat(formData.variantPrice),
      availableStock: parseInt(formData.availableStock),
      maxQtyPerOrder: parseInt(formData.maxQtyPerOrder),
      productSellingPrice: parseFloat(formData.productSellingPrice)
    }

    try {
      const response = await axios.post('https://backend.gezeno.in/api/create-product-variant', payload)
      console.log('Variant created successfully:', response.data)
      setNotification({ type: 'success', message: 'Variant created successfully!' })
      // Reset form or redirect user
    } catch (error) {
      console.error('Error creating variant:', error)
      setNotification({ type: 'error', message: 'Failed to create variant. Please try again.' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading data...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4">
      {notification.message && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className="mb-4">
          {notification.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="variant">Product Variant & Images</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>PRODUCT VARIANT DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productSelect">SELECT PRODUCT</Label>
                <Select onValueChange={handleProductSelect} value={formData.productId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProduct && (
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedProduct.images[0]?.url || '/placeholder.svg'} 
                    alt={selectedProduct.name} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-500">Selected Product</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="variantName">VARIANT NAME</Label>
                <Input 
                  id="variantName" 
                  name="variantName" 
                  value={formData.variantName}
                  onChange={handleInputChange}
                  placeholder="Variant Name" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableStock">AVAILABLE STOCK</Label>
                  <Input 
                    id="availableStock" 
                    name="availableStock" 
                    type="number" 
                    value={formData.availableStock}
                    onChange={handleInputChange}
                    placeholder="100" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxQtyPerOrder">MAX QUANTITY PER ORDER</Label>
                  <Input 
                    id="maxQtyPerOrder" 
                    name="maxQtyPerOrder" 
                    type="number" 
                    value={formData.maxQtyPerOrder}
                    onChange={handleInputChange}
                    placeholder="3" 
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productSellingPrice">PRODUCT SELLING PRICE (Actual price of the product)</Label>
                  <Input 
                    id="productSellingPrice" 
                    name="productSellingPrice" 
                    type="number" 
                    value={formData.productSellingPrice}
                    readOnly
                    className="bg-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variantPrice">VARIANT PRICE</Label>
                <Input 
                  id="variantPrice" 
                  name="variantPrice" 
                  type="number" 
                  value={formData.variantPrice}
                  onChange={handleInputChange}
                  placeholder="1500" 
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variant">
          <Card>
            <CardHeader>
              <CardTitle>VARIANT DETAILS & IMAGES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>SIZES</Label>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={formData.sizes.includes(size)}
                        onCheckedChange={() => handleSizeToggle(size)}
                      />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>IMAGES</Label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      value={image.url}
                      onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Filename"
                      value={image.filename}
                      onChange={(e) => handleImageChange(index, 'filename', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>

              <div className="space-y-4">
                <Label>CUSTOM FIELDS</Label>
                {formData.customFields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Field Name"
                      value={field.name}
                      onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Field Value"
                      value={field.value}
                      onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      className="p-3"
                      size="icon"
                      onClick={() => handleRemoveCustomField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCustomField}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Field
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="mt-6">
        Save Variant Details
      </Button>
    </form>
  )
}