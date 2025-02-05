'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, X, Loader2, Edit, Trash } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

export default function Component() {
  const [filterSections, setFilterSections] = useState([
    { id: 1, name: '', tags: [''], isSaved: false }
  ])
  const [existingFilters, setExistingFilters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState(null)
  const [removedTags, setRemovedTags] = useState([])
  const [newTag, setNewTag] = useState('') // Added new state for new tag input

  useEffect(() => {
    fetchExistingFilters()
  }, [])

  const fetchExistingFilters = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('https://backend.gezeno.in/api/filters')
      setExistingFilters(response.data.filters)
    } catch (error) {
      console.error('Error fetching filters:', error)
      toast.error("Failed to load existing filters")
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = (sectionId) => {
    setFilterSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, tags: [...section.tags, ''] }
          : section
      )
    )
  }

  const updateTag = (sectionId, tagIndex, value) => {
    setFilterSections(sections =>
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
    setFilterSections(sections =>
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

  const updateFilterName = (sectionId, value) => {
    setFilterSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, name: value }
          : section
      )
    )
  }

  const addNewSection = () => {
    const newId = Math.max(...filterSections.map(s => s.id)) + 1
    setFilterSections([...filterSections, { id: newId, name: '', tags: [''], isSaved: false }])
  }

  const saveSection = async (sectionId) => {
    const section = filterSections.find(s => s.id === sectionId)
    if (!section.name.trim()) {
      toast.error("Please enter a filter name")
      return
    }

    if (section.tags.some(tag => !tag.trim())) {
      toast.error("Please fill in all tags or remove empty ones")
      return
    }

    try {
      const response = await axios.post('https://backend.gezeno.in/api/filters', {
        name: section.name,
        tags: section.tags.filter(tag => tag.trim())
      })

      setFilterSections(sections =>
        sections.map(s =>
          s.id === sectionId
            ? { ...s, isSaved: true }
            : s
        )
      )

      toast.success("Filter saved successfully")
      fetchExistingFilters()
    } catch (error) {
      console.error('Error saving filter:', error)
      toast.error("Failed to save filter. Please try again.")
    }
  }

  const openEditModal = (filter) => {
    setEditingFilter({ ...filter })
    setRemovedTags([])
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingFilter(null)
    setRemovedTags([])
    setNewTag('') // Reset newTag when closing the modal
  }

  const updateEditingFilter = (field, value) => {
    setEditingFilter(prev => ({ ...prev, [field]: value }))
  }

  const removeTagFromEdit = (tagToRemove) => {
    setEditingFilter(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
    setRemovedTags(prev => [...prev, tagToRemove])
  }

  const addTagToEdit = () => { // Updated addTagToEdit function
    if (newTag.trim()) {
      setEditingFilter(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const saveEditedFilter = async () => {
    try {
      const response = await axios.post(`https://backend.gezeno.in/api/editfilters/${editingFilter._id}`, {
        name: editingFilter.name,
        tags: editingFilter.tags.filter(tag => tag.trim()),
        removeTags: removedTags
      })

      if (response.data.success) {
        toast.success("Filter updated successfully")
        fetchExistingFilters()
        closeEditModal()
      } else {
        toast.error(response.data.message || "Failed to update filter")
      }
    } catch (error) {
      console.error('Error updating filter:', error)
      toast.error(error.response?.data?.message || "Failed to update filter. Please try again.")
    }
  }

  const deleteFilter = async (filterId) => {
    try {
      await axios.delete(`https://backend.gezeno.in/api/filters/${filterId}`)
      toast.success("Filter deleted successfully")
      fetchExistingFilters()
      closeEditModal()
    } catch (error) {
      console.error('Error deleting filter:', error)
      toast.error("Failed to delete filter. Please try again.")
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Custom Filters</h1>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Filters</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : existingFilters.length > 0 ? (
            <ul className="space-y-2">
              {existingFilters.map((filter) => (
                <li key={filter._id} className="border p-3 rounded-md flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{filter.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filter.tags.map((tag, index) => (
                        <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(filter)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No existing filters found.</p>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Create New Filters</h2>

      {filterSections.map((section) => (
        <Card key={section.id} className="relative">
          <CardContent className="p-6 space-y-4">
            <div>
              <label htmlFor={`filter-name-${section.id}`} className="text-sm font-medium mb-2 block">Name Filter</label>
              <Input
                id={`filter-name-${section.id}`}
                placeholder="eg. clothes, toys etc."
                value={section.name}
                onChange={(e) => updateFilterName(section.id, e.target.value)}
                disabled={section.isSaved}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium mb-2 block">Create Tags</label>
              <div className="space-y-2">
                {section.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="eg. highCollar"
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
                  + Add Tags
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
        Add New Filter Section
      </Button>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Filter</DialogTitle>
          </DialogHeader>
          {editingFilter && (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-filter-name" className="text-sm font-medium mb-2 block">Filter Name</label>
                <Input
                  id="edit-filter-name"
                  value={editingFilter.name}
                  onChange={(e) => updateEditingFilter('name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="space-y-2">
                  {editingFilter.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...editingFilter.tags]
                          newTags[index] = e.target.value
                          updateEditingFilter('tags', newTags)
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTagFromEdit(tag)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2"> {/* Replaced Input with div containing Input and Button */}
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
                  <Button onClick={addTagToEdit}> {/* Updated Button onClick */}
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={() => deleteFilter(editingFilter._id)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
            <Button onClick={saveEditedFilter}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}