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

export default function SubSubSubCategoriesPage() {
  const [subSubSubCategories, setSubSubSubCategories] = React.useState([])
  const [subSubCategories, setSubSubCategories] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [newSubSubSubCategory, setNewSubSubSubCategory] = React.useState({
    name: '',
    description: '',
    image: '',
    imageUrl: '',
    parentSubSubCategory: '',
    isActive: true
  })
  const [editingSubSubSubCategory, setEditingSubSubSubCategory] = React.useState(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [deletingSubSubSubCategory, setDeletingSubSubSubCategory] = React.useState(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchSubSubSubCategories()
    fetchSubSubCategories()
  }, [])

  const fetchSubSubSubCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://backend.gezeno.in/api/products/getSubSubSubCategories')
      setSubSubSubCategories(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch sub-sub-subcategories')
      setLoading(false)
    }
  }

  const fetchSubSubCategories = async () => {
    try {
      const response = await axios.get('https://backend.gezeno.in/api/products/getSubSubCategories')
      setSubSubCategories(response.data)
    } catch (err) {
      console.error('Failed to fetch sub-subcategories', err)
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
          setEditingSubSubSubCategory(prev => ({ ...prev, image: previewUrl, imageUrl: '' }))
        } else {
          setNewSubSubSubCategory(prev => ({ ...prev, image: previewUrl, imageUrl: '' }))
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
      setEditingSubSubSubCategory(prev => ({ ...prev, imageUrl: url, image: '' }))
    } else {
      setNewSubSubSubCategory(prev => ({ ...prev, imageUrl: url, image: '' }))
    }
  }

  const handleCreateSubSubSubCategory = async () => {
    try {
      const subSubSubCategoryData = {
        ...newSubSubSubCategory,
        image: newSubSubSubCategory.image || newSubSubSubCategory.imageUrl
      };
      const response = await axios.post('https://backend.gezeno.in/api/products/createSubSubSubCategory', subSubSubCategoryData)
      if (response.status === 201) {
        await fetchSubSubSubCategories()
        setIsCreateModalOpen(false)
        setNewSubSubSubCategory({
          name: '',
          description: '',
          image: '',
          parentSubSubCategory: '',
          isActive: true
        })
        toast.success('Sub-sub-subcategory created successfully')
      }
    } catch (err) {
      setError('Failed to create sub-sub-subcategory')
      toast.error('Failed to create sub-sub-subcategory')
    }
  }

  const handleUpdateSubSubSubCategory = async () => {
    if (!editingSubSubSubCategory) return

    try {
      const response = await axios.post(`https://backend.gezeno.in/api/products/updateSubSubSubCategory/${editingSubSubSubCategory._id}`, {
        ...editingSubSubSubCategory,
        image: editingSubSubSubCategory.image || editingSubSubSubCategory.imageUrl
      })

      if (response.status === 200) {
        await fetchSubSubSubCategories()
        setIsEditModalOpen(false)
        setEditingSubSubSubCategory(null)
        toast.success('Sub-sub-subcategory updated successfully')
      } else {
        setError('Failed to update sub-sub-subcategory')
        toast.error('Failed to update sub-sub-subcategory')
      }
    } catch (err) {
      setError('Failed to update sub-sub-subcategory')
      console.error('Error updating SubSubSubCategory:', err)
      toast.error('Failed to update sub-sub-subcategory')
    }
  }

  const handleDeleteSubSubSubCategory = async (subSubSubCategoryId) => {
    setIsDeleting(true)
    try {
      const response = await axios.post(`https://backend.gezeno.in/api/products/deleteSubSubSubCategory/${subSubSubCategoryId}`)
      if (response.status === 200) {
        setSubSubSubCategories(prevCategories => prevCategories.filter(category => category._id !== subSubSubCategoryId))
        toast.success('Sub-sub-subcategory deleted successfully')
      } else {
        setError('Failed to delete sub-sub-subcategory')
        toast.error('Failed to delete sub-sub-subcategory')
      }
    } catch (err) {
      setError('Failed to delete sub-sub-subcategory')
      toast.error('Failed to delete sub-sub-subcategory')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeletingSubSubSubCategory(null)
    }
  }

  const getParentSubSubCategoryName = (parentId) => {
    const parent = subSubCategories.find(ssc => ssc._id === parentId)
    return parent ? parent.name : 'Unknown'
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading sub-sub-subcategories...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sub-Sub-SubCategories</h1>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Sub-Sub-SubCategory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sub-Sub-SubCategory</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newSubSubSubCategory.name}
                  onChange={(e) => setNewSubSubSubCategory({ ...newSubSubSubCategory, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newSubSubSubCategory.description}
                  onChange={(e) => setNewSubSubSubCategory({ ...newSubSubSubCategory, description: e.target.value })}
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
                    disabled={isUploading || !!newSubSubSubCategory.imageUrl}
                  />
                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{width: `${uploadProgress}%`}}
                      ></div>
                    </div>
                  )}
                  {newSubSubSubCategory.image && (
                    <img 
                      src={newSubSubSubCategory.image} 
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
                  value={newSubSubSubCategory.imageUrl}
                  onChange={(e) => handleImageUrlChange(e)}
                  placeholder="Enter image URL"
                  className="col-span-3"
                  disabled={!!newSubSubSubCategory.image}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentSubSubCategory" className="text-right">
                  Parent Sub-SubCategory
                </Label>
                <Select
                  onValueChange={(value) => setNewSubSubSubCategory({ ...newSubSubSubCategory, parentSubSubCategory: value })}
                  value={newSubSubSubCategory.parentSubSubCategory}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a parent sub-subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subSubCategories.map((subSubCategory) => (
                      <SelectItem key={subSubCategory._id} value={subSubCategory._id}>
                        {subSubCategory.name}
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
                  checked={newSubSubSubCategory.isActive}
                  onCheckedChange={(checked) => setNewSubSubSubCategory({ ...newSubSubSubCategory, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSubSubSubCategory} disabled={isUploading || newSubSubSubCategory.name === '' || newSubSubSubCategory.parentSubSubCategory === ''}>
                {isUploading ? 'Uploading...' : 'Create Sub-Sub-SubCategory'}
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
            <TableHead>Parent Sub-SubCategory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subSubSubCategories.map((subSubSubCategory) => (
            <TableRow key={subSubSubCategory._id}>
              <TableCell>
                <div className="flex items-center">
                  {subSubSubCategory.image && (
                    <img
                      src={subSubSubCategory.image}
                      alt={subSubSubCategory.name}
                      className="w-10 h-10 rounded-full mr-2 object-cover"
                    />
                  )}
                  {subSubSubCategory.name}
                </div>
              </TableCell>
              <TableCell>{subSubSubCategory.description}</TableCell>
              <TableCell>{getParentSubSubCategoryName(subSubSubCategory.parentSubSubCategory)}</TableCell>
              <TableCell>
                <Switch
                  checked={subSubSubCategory.isActive}
                  onCheckedChange={(checked) => {
                    const updatedSubSubSubCategory = { ...subSubSubCategory, isActive: checked };
                    setEditingSubSubSubCategory(updatedSubSubSubCategory);
                    handleUpdateSubSubSubCategory();
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingSubSubSubCategory(subSubSubCategory)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Sub-Sub-SubCategory</DialogTitle>
                      </DialogHeader>
                      {editingSubSubSubCategory && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingSubSubSubCategory.name}
                              onChange={(e) => setEditingSubSubSubCategory({ ...editingSubSubSubCategory, name: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="edit-description"
                              value={editingSubSubSubCategory.description}
                              onChange={(e) => setEditingSubSubSubCategory({ ...editingSubSubSubCategory, description: e.target.value })}
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
                                disabled={isUploading || !!editingSubSubSubCategory.imageUrl}
                              />
                              {uploadProgress > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{width: `${uploadProgress}%`}}
                                  ></div>
                                </div>
                              )}
                              {editingSubSubSubCategory.image && (
                                <img 
                                  src={editingSubSubSubCategory.image} 
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
                              value={editingSubSubSubCategory.imageUrl}
                              onChange={(e) => handleImageUrlChange(e, true)}
                              placeholder="Enter image URL"
                              className="col-span-3"
                              disabled={!!editingSubSubSubCategory.image}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-parentSubSubCategory" className="text-right">
                              Parent Sub-SubCategory
                            </Label>
                            <Select
                              onValueChange={(value) => setEditingSubSubSubCategory({ ...editingSubSubSubCategory, parentSubSubCategory: value })}
                              value={editingSubSubSubCategory.parentSubSubCategory}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a parent sub-subcategory" />
                              </SelectTrigger>
                              <SelectContent>
                                {subSubCategories.map((subSubCategory) => (
                                  <SelectItem key={subSubCategory._id} value={subSubCategory._id}>
                                    {subSubCategory.name}
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
                              checked={editingSubSubSubCategory.isActive}
                              onCheckedChange={(checked) => setEditingSubSubSubCategory({ ...editingSubSubSubCategory, isActive: checked })}
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          onClick={handleUpdateSubSubSubCategory} 
                          disabled={isUploading || !editingSubSubSubCategory || editingSubSubSubCategory.name === '' || editingSubSubSubCategory.parentSubSubCategory === ''}
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
                        onClick={() => setDeletingSubSubSubCategory(subSubSubCategory)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Sub-Sub-SubCategory</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this sub-sub-subcategory? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteSubSubSubCategory(deletingSubSubSubCategory._id)}
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