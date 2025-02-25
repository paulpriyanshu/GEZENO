'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { GripVertical, Plus, Trash2, Loader2, ChevronDown, Edit } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [subsubcategories, setSubsubcategories] = useState([])
  const [subsubsubcategories, setSubsubsubcategories] = useState([])
  
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState('')
  const [selectedSubsubsubcategory, setSelectedSubsubsubcategory] = useState('')
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const scrollAreaRef = useRef(null)

  const [editingItem, setEditingItem] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [categoriesResponse, menuItemsResponse] = await Promise.all([
        axios.get('https://backend.gezeno.in/api/products/getOnlyCategories'),
        axios.get('https://backend.gezeno.in/api/submenu')
      ])
      setCategories(categoriesResponse.data)
      setMenuItems(menuItemsResponse.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(menuItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setMenuItems(items)
    // TODO: Implement API call to update order on the server
  }

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/products/getsubcategories/${categoryId}`)
      setSubcategories(response.data.subCategories || [])
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast.error('Failed to load subcategories')
    }
  }

  const fetchSubSubcategories = async (subcategoryId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/products/getsubsubcategories/${subcategoryId}`)
      setSubsubcategories(response.data.subSubCategories || [])
    } catch (error) {
      console.error('Error fetching sub-subcategories:', error)
      toast.error('Failed to load sub-subcategories')
    }
  }

  const fetchSubSubSubcategories = async (subSubcategoryId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/products/getsubsubsubcategories/${subSubcategoryId}`)
      setSubsubsubcategories(response.data.subSubSubCategories || [])
    } catch (error) {
      console.error('Error fetching sub-sub-subcategories:', error)
      toast.error('Failed to load sub-sub-subcategories')
    }
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory('')
    setSelectedSubsubcategory('')
    setSelectedSubsubsubcategory('')
    fetchSubcategories(categoryId)
  }

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId)
    setSelectedSubsubcategory('')
    setSelectedSubsubsubcategory('')
    fetchSubSubcategories(subcategoryId)
  }

  const handleSubSubcategoryChange = (subSubcategoryId) => {
    setSelectedSubsubcategory(subSubcategoryId)
    setSelectedSubsubsubcategory('')
    fetchSubSubSubcategories(subSubcategoryId)
  }

  const addMenuItem = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category')
      return
    }

    setIsSaving(true)
    try {
      const categoryId = selectedSubsubsubcategory || selectedSubsubcategory || selectedSubcategory || selectedCategory
      const categoryType = selectedSubsubsubcategory ? 'SubSubSubCategory' :
                           selectedSubsubcategory ? 'SubSubCategory' :
                           selectedSubcategory ? 'SubCategory' : 'ParentCategory'
      
      const response = await axios.post('https://backend.gezeno.in/api/products/submenu', {
        categoryId,
        categoryType
      })

      // Find the category data for the newly added item
      let categoryData = await getCategoryData(categoryId, categoryType)

      // Add the new item with category data to the menuItems state
      const newItem = {
        ...response.data.data,
        categoryData: categoryData
      }
      setMenuItems(prevItems => [...prevItems, newItem])
      toast.success('Menu item category added successfully')
    } catch (error) {
      console.error('Error adding menu item category:', error)
      toast.error('Failed to add menu item category')
    } finally {
      setIsSaving(false)
    }
  }

  const removeMenuItem = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/products/submenu/${id}`)
      setMenuItems(menuItems.filter(item => item._id !== id))
      toast.success('Menu item category removed successfully')
    } catch (error) {
      console.error('Error removing menu item category:', error)
      toast.error('Failed to remove menu item category')
    }
  }

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      setShowScrollIndicator(scrollTop < scrollHeight - clientHeight - 20)
    }
  }

  const getCategoryName = (item) => {
    return item.categoryData?.name || 'Unknown'
  }

  const handleEditClick = (item) => {
    setEditingItem(item)
    // Reset all category selections
    setSelectedCategory('')
    setSelectedSubcategory('')
    setSelectedSubsubcategory('')
    setSelectedSubsubsubcategory('')
    setIsEditDialogOpen(true)
  }

  const getCategoryData = async (categoryId, categoryType) => {
    switch (categoryType) {
      case 'ParentCategory':
        return categories.find(c => c._id === categoryId)
      case 'SubCategory':
        return subcategories.find(c => c._id === categoryId)
      case 'SubSubCategory':
        return subsubcategories.find(c => c._id === categoryId)
      case 'SubSubSubCategory':
        return subsubsubcategories.find(c => c._id === categoryId)
      default:
        return null
    }
  }

  const handleEditSave = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category')
      return
    }

    setIsSaving(true)
    try {
      const categoryId = selectedSubsubsubcategory || selectedSubsubcategory || selectedSubcategory || selectedCategory
      
      const response = await axios.post(`https://backend.gezeno.in/api/products/editsubmenu/${editingItem._id}`, {
        categoryId
      })

      // Get the updated category data
      const updatedCategoryData = await getCategoryData(categoryId, response.data.data.categoryType)

      // Update the item in the menuItems state with the new category data
      setMenuItems(prevItems => prevItems.map(item => 
        item._id === editingItem._id ? { ...response.data.data, categoryData: updatedCategoryData } : item
      ))

      setIsEditDialogOpen(false)
      setEditingItem(null)
      toast.success('Menu item category updated successfully')
    } catch (error) {
      console.error('Error updating menu item category:', error)
      toast.error('Failed to update menu item category')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-center">Menu Items Categories</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Menu Items Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="menuItems">
              {(provided) => (
                <div className="relative">
                  <ScrollArea 
                    className="h-[400px] w-full rounded-md border"
                    ref={scrollAreaRef}
                    onScroll={handleScroll}
                  >
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 p-2">
                      {menuItems.map((item, index) => (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm transition-all hover:shadow-md"
                            >
                              <GripVertical className="h-4 w-4 text-gray-500" />
                              <div className="flex-grow">
                                <p className="text-sm font-medium">{getCategoryName(item)}</p>
                                <p className="text-xs text-gray-500">{item.categoryType}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(item)}
                                className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeMenuItem(item._id)}
                                className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                  {showScrollIndicator && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-center items-center h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400 animate-bounce" />
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-4 space-y-2">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
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
            {selectedCategory && (
              <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedSubcategory && (
              <Select value={selectedSubsubcategory} onValueChange={handleSubSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subsubcategories.map((subsubcategory) => (
                    <SelectItem key={subsubcategory._id} value={subsubcategory._id}>
                      {subsubcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedSubsubcategory && (
              <Select value={selectedSubsubsubcategory} onValueChange={setSelectedSubsubsubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-sub-subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subsubsubcategories.map((subsubsubcategory) => (
                    <SelectItem key={subsubsubcategory._id} value={subsubsubcategory._id}>
                      {subsubsubcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button 
              onClick={addMenuItem} 
              className="w-full bg-slate-700 hover:bg-slate-800 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Menu Item Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
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
            {selectedCategory && (
              <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedSubcategory && (
              <Select value={selectedSubsubcategory} onValueChange={handleSubSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subsubcategories.map((subsubcategory) => (
                    <SelectItem key={subsubcategory._id} value={subsubcategory._id}>
                      {subsubcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedSubsubcategory && (
              <Select value={selectedSubsubsubcategory} onValueChange={setSelectedSubsubsubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-sub-subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subsubsubcategories.map((subsubsubcategory) => (
                    <SelectItem key={subsubsubcategory._id} value={subsubsubcategory._id}>
                      {subsubsubcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button 
              onClick={handleEditSave} 
              className="w-full bg-slate-700 hover:bg-slate-800 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}