'use client'

import * as React from "react"
import axios from 'axios'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

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
  DialogDescription,
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

export default function SubSubCategoriesPage() {
  const [subSubCategories, setSubSubCategories] = React.useState([])
  const [subCategories, setSubCategories] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [newSubSubCategory, setNewSubSubCategory] = React.useState({
    name: '',
    description: '',
    image: '',
    imageUrl: '',
    parentSubCategory: '',
    isActive: true
  })
  const [editingSubSubCategory, setEditingSubSubCategory] = React.useState(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [deletingSubSubCategory, setDeletingSubSubCategory] = React.useState(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchSubSubCategories()
    fetchSubCategories()
  }, [])

  const fetchSubSubCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://backend.gezeno.in/api/getSubSubCategories')
      setSubSubCategories(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch sub-subcategories')
      setLoading(false)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get('https://backend.gezeno.in/api/getSubCategories')
      setSubCategories(response.data)
    } catch (err) {
      console.error('Failed to fetch subcategories', err)
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
          setEditingSubSubCategory(prev => ({ ...prev, image: previewUrl, imageUrl: '' }))
        } else {
          setNewSubSubCategory(prev => ({ ...prev, image: previewUrl, imageUrl: '' }))
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
      setEditingSubSubCategory(prev => ({ ...prev, imageUrl: url, image: '' }))
    } else {
      setNewSubSubCategory(prev => ({ ...prev, imageUrl: url, image: '' }))
    }
  }

  const handleCreateSubSubCategory = async () => {
    try {
      const subSubCategoryData = {
        ...newSubSubCategory,
        image: newSubSubCategory.image || newSubSubCategory.imageUrl
      };
      const response = await axios.post('https://backend.gezeno.in/api/createSubSubCategory', subSubCategoryData)
      if (response.status === 201) {
        await fetchSubSubCategories()
        setIsCreateModalOpen(false)
        setNewSubSubCategory({
          name: '',
          description: '',
          image: '',
          parentSubCategory: '',
          isActive: true
        })
        toast.success('Sub-subcategory created successfully')
      }
    } catch (err) {
      setError('Failed to create sub-subcategory')
      toast.error('Failed to create sub-subcategory')
    }
  }

  const handleUpdateSubSubCategory = async () => {
    if (!editingSubSubCategory) return

    try {
      const response = await axios.post(`https://backend.gezeno.in/api/updateSubSubCategory/${editingSubSubCategory._id}`, {
        ...editingSubSubCategory,
        image: editingSubSubCategory.image || editingSubSubCategory.imageUrl
      })

      if (response.status === 200) {
        await fetchSubSubCategories()
        setIsEditModalOpen(false)
        setEditingSubSubCategory(null)
        toast.success('Sub-subcategory updated successfully')
      } else {
        setError('Failed to update sub-subcategory')
        toast.error('Failed to update sub-subcategory')
      }
    } catch (err) {
      setError('Failed to update sub-subcategory')
      console.error('Error updating SubSubCategory:', err)
      toast.error('Failed to update sub-subcategory')
    }
  }

  const handleDeleteSubSubCategory = async (subSubCategoryId) => {
    setIsDeleting(true)
    try {
      const response = await axios.post(`https://backend.gezeno.in/api/deleteSubSubCategory/${subSubCategoryId}`)
      if (response.status === 200) {
        setSubSubCategories(prevCategories => prevCategories.filter(category => category._id !== subSubCategoryId))
        toast.success('Sub-subcategory deleted successfully')
      } else {
        setError('Failed to delete sub-subcategory')
        toast.error('Failed to delete sub-subcategory')
      }
    } catch (err) {
      setError('Failed to delete sub-subcategory')
      toast.error('Failed to delete sub-subcategory')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeletingSubSubCategory(null)
    }
  }

  const getParentSubCategoryName = (parentId) => {
    const parent = subCategories.find(sc => sc._id === parentId)
    return parent ? parent.name : 'Unknown'
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading sub-subcategories...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sub-SubCategories</h1>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Sub-SubCategory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sub-SubCategory</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newSubSubCategory.name}
                  onChange={(e) => setNewSubSubCategory({ ...newSubSubCategory, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newSubSubCategory.description}
                  onChange={(e) => setNewSubSubCategory({ ...newSubSubCategory, description: e.target.value })}
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
                    disabled={isUploading || !!newSubSubCategory.imageUrl}
                  />
                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{width: `${uploadProgress}%`}}
                      ></div>
                    </div>
                  )}
                  {newSubSubCategory.image && (
                    <img 
                      src={newSubSubCategory.image} 
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
                  value={newSubSubCategory.imageUrl}
                  onChange={(e) => handleImageUrlChange(e)}
                  placeholder="Enter image URL"
                  className="col-span-3"
                  disabled={!!newSubSubCategory.image}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentSubCategory" className="text-right">
                  Parent Sub-Category
                </Label>
                <Select
                  onValueChange={(value) => setNewSubSubCategory({ ...newSubSubCategory, parentSubCategory: value })}
                  value={newSubSubCategory.parentSubCategory}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a parent sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCategory) => (
                      <SelectItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
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
                  checked={newSubSubCategory.isActive}
                  onCheckedChange={(checked) => setNewSubSubCategory({ ...newSubSubCategory, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSubSubCategory} disabled={isUploading || newSubSubCategory.name === '' || newSubSubCategory.parentSubCategory === ''}>
                {isUploading ? 'Uploading...' : 'Create Sub-SubCategory'}
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
            <TableHead>Parent Sub-Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subSubCategories.map((subSubCategory) => (
            <TableRow key={subSubCategory._id}>
              <TableCell>
                <div className="flex items-center">
                  {subSubCategory.image && (
                    <img
                      src={subSubCategory.image}
                      alt={subSubCategory.name}
                      className="w-10 h-10 rounded-full mr-2 object-cover"
                    />
                  )}
                  {subSubCategory.name}
                </div>
              </TableCell>
              <TableCell>{subSubCategory.description}</TableCell>
              <TableCell>{getParentSubCategoryName(subSubCategory.parentSubCategory)}</TableCell>
              <TableCell>
                <Switch
                  checked={subSubCategory.isActive}
                  onCheckedChange={(checked) => {
                    const updatedSubSubCategory = { ...subSubCategory, isActive: checked };
                    setEditingSubSubCategory(updatedSubSubCategory);
                    handleUpdateSubSubCategory();
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingSubSubCategory(subSubCategory)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Sub-SubCategory</DialogTitle>
                      </DialogHeader>
                      {editingSubSubCategory && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingSubSubCategory.name}
                              onChange={(e) => setEditingSubSubCategory({ ...editingSubSubCategory, name: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="edit-description"
                              value={editingSubSubCategory.description}
                              onChange={(e) => setEditingSubSubCategory({ ...editingSubSubCategory, description: e.target.value })}
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
                                disabled={isUploading || !!editingSubSubCategory.imageUrl}
                              />
                              {uploadProgress > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{width: `${uploadProgress}%`}}
                                  ></div>
                                </div>
                              )}
                              {editingSubSubCategory.image && (
                                <img 
                                  src={editingSubSubCategory.image} 
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
                              value={editingSubSubCategory.imageUrl}
                              onChange={(e) => handleImageUrlChange(e, true)}
                              placeholder="Enter image URL"
                              className="col-span-3"
                              disabled={!!editingSubSubCategory.image}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-parentSubCategory" className="text-right">
                              Parent Sub-Category
                            </Label>
                            <Select
                              onValueChange={(value) => setEditingSubSubCategory({ ...editingSubSubCategory, parentSubCategory: value })}
                              value={editingSubSubCategory.parentSubCategory}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a parent sub-category" />
                              </SelectTrigger>
                              <SelectContent>
                                {subCategories.map((subCategory) => (
                                  <SelectItem key={subCategory._id} value={subCategory._id}>
                                    {subCategory.name}
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
                              checked={editingSubSubCategory.isActive}
                              onCheckedChange={(checked) => setEditingSubSubCategory({ ...editingSubSubCategory, isActive: checked })}
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          onClick={handleUpdateSubSubCategory} 
                          disabled={isUploading || !editingSubSubCategory || editingSubSubCategory.name === '' || editingSubSubCategory.parentSubCategory === ''}
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingSubSubCategory(subSubCategory)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Sub-SubCategory</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this sub-subcategory? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteSubSubCategory(deletingSubSubCategory._id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}