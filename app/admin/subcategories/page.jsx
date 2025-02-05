'use client'

import * as React from "react"
import axios from 'axios'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'react-hot-toast'

export default function SubCategoriesPage() {
  const [categories, setCategories] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [newSubCategory, setNewSubCategory] = React.useState({
    name: '',
    description: '',
    image: '',
    imageUrl: '',
    parentCategory: '',
    isActive: true
  })
  const [editingSubCategory, setEditingSubCategory] = React.useState(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)

  React.useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://backend.gezeno.in/api/getCategories')
      setCategories(response.data)
      console.log(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch categories')
      setLoading(false)
    }
  }

  const handleImageUpload = async (e, isEditing = false) => {
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

        if (isEditing) {
          setEditingSubCategory(prev => ({ ...prev, image: previewUrl, imageUrl: '' }))
        } else {
          setNewSubCategory(prev => ({ ...prev, image: previewUrl, imageUrl: '' }))
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

  const handleImageUrlChange = (e, isEditing = false) => {
    const url = e.target.value
    if (isEditing) {
      setEditingSubCategory(prev => ({ ...prev, imageUrl: url, image: '' }))
    } else {
      setNewSubCategory(prev => ({ ...prev, imageUrl: url, image: '' }))
    }
  }

  const handleCreateSubCategory = async () => {
    try {
      const subCategoryData = {
        ...newSubCategory,
        image: newSubCategory.image || newSubCategory.imageUrl
      };

      const response = await axios.post('https://backend.gezeno.in/api/createSubCategory', subCategoryData)
      if (response.status === 201) {
        await fetchCategories()
        setIsCreateModalOpen(false)
        setNewSubCategory({
          name: '',
          description: '',
          image: '',
          imageUrl: '',
          parentSubCategoryId: '',
          isActive: true
        })
        toast.success('Sub-category created successfully')
      }
    } catch (err) {
      console.log(err)
      setError('Failed to create sub-category')
      toast.error('Failed to create sub-category')
    }
  }

  const handleUpdateSubCategory = async () => {
    if (!editingSubCategory) return

    try {
      const response = await axios.post(`https://backend.gezeno.in/api/updateSubCategory/${editingSubCategory._id}`, {
        ...editingSubCategory,
        image: editingSubCategory.image || editingSubCategory.imageUrl
      })

      if (response.status === 200) {
        await fetchCategories()
        setIsEditModalOpen(false)
        setEditingSubCategory(null)
        toast.success('Sub-category updated successfully')
      } else {
        setError('Failed to update sub-category')
        toast.error('Failed to update sub-category')
      }
    } catch (err) {
      setError('Failed to update sub-category')
      console.error('Error updating SubCategory:', err)
      toast.error('Failed to update sub-category')
    }
  }

  const handleDeleteSubCategory = async (subCategoryId) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      try {
        const response = await axios.post(`https://backend.gezeno.in/api/deleteSubCategory/${subCategoryId}`)
        if (response.data.success) {
          await fetchCategories()
          toast.success('Sub-category deleted successfully')
        } else {
          setError('Failed to delete sub-category')
          toast.error('Failed to delete sub-category')
        }
      } catch (err) {
        setError('Failed to delete sub-category')
        toast.error('Failed to delete sub-category')
      }
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading categories...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sub-Categories</h1>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Sub-Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sub-Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newSubCategory.name}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newSubCategory.description}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <Input
                    id="image"
                    type="file"
                    onChange={(e) => handleImageUpload(e)}
                    accept="image/*"
                    disabled={isUploading || !!newSubCategory.imageUrl}
                  />
                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{width: `${uploadProgress}%`}}
                      ></div>
                    </div>
                  )}
                  {newSubCategory.image && (
                    <img 
                      src={newSubCategory.image} 
                      alt="Preview" 
                      className="mt-2 w-full max-h-40 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={newSubCategory.imageUrl}
                  onChange={(e) => handleImageUrlChange(e)}
                  placeholder="Enter image URL"
                  className="col-span-3"
                  disabled={!!newSubCategory.image}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentCategory" className="text-right">
                  Parent Category
                </Label>
                <Select
                  onValueChange={(value) => setNewSubCategory({ ...newSubCategory, parentCategory: value })}
                  value={newSubCategory.parentCategory}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a parent category" />
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
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <Switch
                  id="isActive"
                  checked={newSubCategory.isActive}
                  onCheckedChange={(checked) => setNewSubCategory({ ...newSubCategory, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSubCategory} disabled={isUploading || newSubCategory.name === '' || newSubCategory.parentCategory === ''}>
                {isUploading ? 'Uploading...' : 'Create Sub-Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <React.Fragment key={category._id}>
              {category.subCategories && category.subCategories.map((subCategory) => (
                <TableRow key={subCategory._id}>
                  <TableCell>
                    <div className="flex items-center">
                      {subCategory.image && (
                        <img
                          src={subCategory.image}
                          alt={subCategory.name}
                          className="w-10 h-10 rounded-full mr-2 object-cover"
                        />
                      )}
                      {subCategory.name}
                    </div>
                  </TableCell>
                  <TableCell>{subCategory.description}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={subCategory.isActive}
                      onCheckedChange={(checked) => {
                        const updatedSubCategory = { ...subCategory, isActive: checked };
                        setEditingSubCategory(updatedSubCategory);
                        handleUpdateSubCategory();
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingSubCategory(subCategory)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Sub-Category</DialogTitle>
                          </DialogHeader>
                          {editingSubCategory && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingSubCategory.name}
                                  onChange={(e) => setEditingSubCategory({ ...editingSubCategory, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-description" className="text-right">
                                  Description
                                </Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingSubCategory.description}
                                  onChange={(e) => setEditingSubCategory({ ...editingSubCategory, description: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-image" className="text-right">
                                  Image
                                </Label>
                                <div className="col-span-3">
                                  <Input
                                    id="edit-image"
                                    type="file"
                                    onChange={(e) => handleImageUpload(e, true)}
                                accept="image/*"
                                    disabled={isUploading || !!editingSubCategory.imageUrl}
                                  />
                                  {uploadProgress > 0 && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                      <div 
                                        className="bg-blue-600 h-2.5 rounded-full" 
                                        style={{width: `${uploadProgress}%`}}
                                      ></div>
                                    </div>
                                  )}
                                  {editingSubCategory.image && (
                                    <img 
                                      src={editingSubCategory.image} 
                                      alt="Preview" 
                                      className="mt-2 w-full max-h-40 object-cover rounded"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-imageUrl" className="text-right">
                                  Image URL
                                </Label>
                                <Input
                                  id="edit-imageUrl"
                                  type="url"
                                  value={editingSubCategory.imageUrl}
                                  onChange={(e) => handleImageUrlChange(e, true)}
                                  placeholder="Enter image URL"
                                  className="col-span-3"
                                  disabled={!!editingSubCategory.image}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-parentCategory" className="text-right">
                                  Parent Category
                                </Label>
                                <Select
                                  onValueChange={(value) => setEditingSubCategory({ ...editingSubCategory, parentCategory: value })}
                                  value={editingSubCategory.parentCategory}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a parent category" />
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
                                <Label htmlFor="edit-isActive" className="text-right">
                                  Active
                                </Label>
                                <Switch
                                  id="edit-isActive"
                                  checked={editingSubCategory.isActive}
                                  onCheckedChange={(checked) => setEditingSubCategory({ ...editingSubCategory, isActive: checked })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              onClick={handleUpdateSubCategory} 
                              disabled={isUploading || !editingSubCategory || editingSubCategory.name === '' || editingSubCategory.parentCategory === ''}
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubCategory(subCategory._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}