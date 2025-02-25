'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, X, Loader2, Edit, Trash } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

export default function SizeManagement() {
  const [sizeSections, setSizeSections] = useState([
    { id: 1, name: '', tags: [], isSaved: false }
  ])
  const [existingSizes, setExistingSizes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSize, setEditingSize] = useState(null)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    fetchExistingSizes()
  }, [])

  const fetchExistingSizes = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('https://backend.gezeno.in/api/products/sizes')
      setExistingSizes(response.data.sizes)
    } catch (error) {
      console.error('Error fetching sizes:', error)
      setExistingSizes([])
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = (sectionId) => {
    setSizeSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, tags: [...section.tags, ''] }
          : section
      )
    )
  }

  const updateTag = (sectionId, tagIndex, value) => {
    setSizeSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tags: section.tags.map((tag, i) =>
                i === tagIndex ? value : tag
              )
            }
          : section
      )
    )
  }

  const removeTag = (sectionId, tagIndex) => {
    setSizeSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tags: section.tags.filter((_, i) => i !== tagIndex)
            }
          : section
      )
    )
  }

  const updateSizeName = (sectionId, value) => {
    setSizeSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, name: value }
          : section
      )
    )
  }

  const addNewSection = () => {
    const newId = Math.max(...sizeSections.map(s => s.id)) + 1
    setSizeSections([...sizeSections, { id: newId, name: '', tags: [], isSaved: false }])
  }

  const saveSection = async (sectionId) => {
    const section = sizeSections.find(s => s.id === sectionId)
    if (!section.name.trim()) {
      toast.error("Please enter a size category name")
      return
    }

    if (section.tags.some(tag => !tag.trim())) {
      toast.error("Please fill in all tags or remove empty ones")
      return
    }

    try {
      const response = await axios.post('https://backend.gezeno.in/products/api/sizes', {
        name: section.name,
        tags: section.tags.filter(tag => tag.trim())
      })

      setSizeSections(sections =>
        sections.map(s =>
          s.id === sectionId
            ? { ...s, isSaved: true }
            : s
        )
      )

      toast.success("Size category saved successfully")
      fetchExistingSizes()
    } catch (error) {
      console.error('Error saving size category:', error)
      toast.error("Failed to save size category. Please try again.")
    }
  }

  const openEditModal = (size) => {
    setEditingSize({ ...size })
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingSize(null)
    setNewTag('')
  }

  const updateEditingSize = (field, value) => {
    setEditingSize(prev => ({ ...prev, [field]: value }))
  }

  const updateExistingTag = (index, value) => {
    setEditingSize(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }))
  }

  const removeExistingTag = (index) => {
    setEditingSize(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const addTagToEdit = () => {
    if (newTag.trim() && !editingSize.tags.includes(newTag.trim())) {
      setEditingSize(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const saveEditedSize = async () => {
    try {
      const response = await axios.post(`https://backend.gezeno.in/api/products/sizes/${editingSize._id}`, {
        name: editingSize.name,
        tags: editingSize.tags.filter(tag => tag.trim())
      })

      if (response.data.success) {
        toast.success("Size category updated successfully")
        fetchExistingSizes()
        closeEditModal()
      } else {
        toast.error(response.data.message || "Failed to update size category")
      }
    } catch (error) {
      console.error('Error updating size category:', error)
      toast.error(error.response?.data?.message || "Failed to update size category. Please try again.")
    }
  }

  const deleteSize = async (sizeId) => {
    try {
      await axios.delete(`https://backend.gezeno.in/api/products/sizes/${sizeId}`)
      toast.success("Size category deleted successfully")
      fetchExistingSizes()
      closeEditModal()
    } catch (error) {
      console.error('Error deleting size category:', error)
      toast.error("Failed to delete size category. Please try again.")
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Size Categories</h1>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Size Categories</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : existingSizes.length > 0 ? (
            <ul className="space-y-2">
              {existingSizes.map((size) => (
                <li key={size._id} className="border p-3 rounded-md flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{size.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {size.tags.map((tag, index) => (
                        <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(size)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No sizes added</p>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Create New Size Category</h2>

      {sizeSections.map((section) => (
        <Card key={section.id} className="relative">
          <CardContent className="p-6 space-y-4">
            <div>
              <label htmlFor={`size-name-${section.id}`} className="text-sm font-medium mb-2 block">Category Name</label>
              <Input
                id={`size-name-${section.id}`}
                placeholder="eg. T-Shirts, Pants, etc."
                value={section.name}
                onChange={(e) => updateSizeName(section.id, e.target.value)}
                disabled={section.isSaved}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium mb-2 block">Add Tags</label>
              <div className="space-y-2">
                {section.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="eg. S, M, L, XL"
                      value={tag}
                      onChange={(e) => updateTag(section.id, index, e.target.value)}
                      disabled={section.isSaved}
                      aria-label={`Tag ${index + 1}`}
                    />
                    {!section.isSaved && section.tags.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTag(section.id, index)}
                        aria-label={`Remove tag ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {!section.isSaved && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => addTag(section.id)}
                >
                  + Add Tag
                </Button>
              )}
            </div>

            {!section.isSaved && (
              <Button 
                className="w-full"
                onClick={() => saveSection(section.id)}
              >
                Save
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        className="w-full h-24 text-lg mt-8"
        onClick={addNewSection}
      >
        <Plus className="h-6 w-6 mr-2" />
        Add New Size Category
      </Button>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Size Category</DialogTitle>
          </DialogHeader>
          {editingSize && (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-size-name" className="text-sm font-medium mb-2 block">Category Name</label>
                <Input
                  id="edit-size-name"
                  value={editingSize.name}
                  onChange={(e) => updateEditingSize('name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="space-y-2">
                  {editingSize.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => updateExistingTag(index, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExistingTag(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTagToEdit()
                        }
                      }}
                    />
                    <Button onClick={addTagToEdit}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={() => deleteSize(editingSize._id)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
            <Button onClick={saveEditedSize}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

