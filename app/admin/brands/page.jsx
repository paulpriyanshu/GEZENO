'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [newBrand, setNewBrand] = useState({ name: '', image: '' })
  const [editingBrand, setEditingBrand] = useState(null)
  const [isAddingBrand, setIsAddingBrand] = useState(false)
  const [isEditingBrand, setIsEditingBrand] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('https://backend.gezeno.in/api/products/getallbrands')
      if (response.data.success && Array.isArray(response.data.data)) {
        setBrands(response.data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching brands:', err)
      setError('Failed to fetch brands. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBrands = brands.filter(brand => {
    if (filter === 'all') return true
    if (filter === 'active') return brand.isActive
    if (filter === 'inactive') return !brand.isActive
    return true
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingBrand) {
      setEditingBrand(prev => ({ ...prev, [name]: value }))
    } else {
      setNewBrand(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        setIsUploading(true)
        setUploadProgress(0)
        const uploadUrlResponse = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`)
        const { url, filename } = uploadUrlResponse.data

        await axios.put(url, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        })

        const previewResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`)
        const previewUrl = previewResponse.data.url

        if (editingBrand) {
          setEditingBrand(prev => ({ ...prev, image: previewUrl }))
        } else {
          setNewBrand(prev => ({ ...prev, image: previewUrl }))
        }
        toast.success('Image uploaded successfully')
      } catch (error) {
        console.error('Error uploading image:', error)
        toast.error('Failed to upload image. Please try again.')
      } finally {
        setUploadProgress(0)
        setIsUploading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsAddingBrand(true)

    try {
      const response = await axios.post('https://backend.gezeno.in/api/createbrands', newBrand)
      if (response.data.success) {
        toast.success('Brand added successfully')
        setNewBrand({ name: '', image: '' })
        setIsDialogOpen(false)
        fetchBrands()
      } else {
        throw new Error(response.data.message || 'Failed to add brand')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add brand. Please try again.')
      console.error('Error adding brand:', err)
    } finally {
      setIsAddingBrand(false)
    }
  }

  const handleEdit = (brand) => {
    setEditingBrand(brand)
    setIsDialogOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsEditingBrand(true)

    try {
      const response = await axios.post(`https://backend.gezeno.in/api/updateBrand/${editingBrand._id}`, editingBrand)
      if (response.data.success) {
        toast.success('Brand updated successfully')
        setIsDialogOpen(false)
        fetchBrands()
      } else {
        throw new Error(response.data.message || 'Failed to update brand')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update brand. Please try again.')
      console.error('Error updating brand:', err)
    } finally {
      setIsEditingBrand(false)
      setEditingBrand(null)
    }
  }

  const handleDelete = async (brandId) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        const response = await axios.post(`https://backend.gezeno.in/api/deletebrand/${brandId}`)
        if (response.data.success) {
          toast.success('Brand deleted successfully')
          fetchBrands()
        } else {
          throw new Error(response.data.message || 'Failed to delete brand')
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete brand. Please try again.')
        console.error('Error deleting brand:', err)
      }
    }
  }

  const handleToggleActive = async (brandId, currentStatus) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/toggleBrand/${brandId}`, {
        isActive: !currentStatus
      })
      if (response.data.success) {
        toast.success(`Brand ${currentStatus ? 'deactivated' : 'activated'} successfully`)
        setBrands(prevBrands => prevBrands.map(brand => 
          brand._id === brandId ? { ...brand, isActive: !currentStatus } : brand
        ))
      } else {
        throw new Error(response.data.message || 'Failed to update brand status')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update brand status. Please try again.')
      console.error('Error updating brand status:', err)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p>{error}</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <Card key={brand._id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {brand.name}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={brand.isActive}
                    onCheckedChange={() => handleToggleActive(brand._id, brand.isActive)}
                  />
                  <Badge variant={brand.isActive ? "default" : "secondary"}>
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40 mb-4">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=160&width=240"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Created: {new Date(brand.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(brand)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(brand._id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Brands</h1>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Brands
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Active Brands
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilter('inactive')}
          >
            Inactive Brands
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingBrand(null)
              setNewBrand({ name: '', image: '' })
            }
          }}>
            <DialogTrigger asChild>
              <Button>Add New Brand</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingBrand ? handleUpdate : handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editingBrand ? editingBrand.name : newBrand.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Brand Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                )}
                {(editingBrand?.image || newBrand.image) && (
                  <div className="relative w-full h-40">
                    <img
                      src={editingBrand ? editingBrand.image : newBrand.image}
                      alt="Brand preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <Button type="submit" disabled={isAddingBrand || isEditingBrand || isUploading}>
                  {isAddingBrand || isEditingBrand ? 'Processing...' : (editingBrand ? 'Update Brand' : 'Add Brand')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="container mx-auto p-4">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  )
}