'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Loader2, Trash2, Edit } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function MobileCategoryHeader() {
  const [submenuItems, setSubmenuItems] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [subcategories, setSubcategories] = useState([])
  const [subSubcategories, setSubSubcategories] = useState([])
  const [subSubSubcategories, setSubSubSubcategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [categoriesResponse, submenuResponse] = await Promise.all([
        axios.get('https://backend.gezeno.in/api/getOnlyCategories'),
        axios.get('https://backend.gezeno.in/api/mobileCategoryHeader')
      ])
    
      if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
        toast.error('No categories available')
        setAvailableCategories([])
      } else {
        setAvailableCategories(categoriesResponse.data)
      }

      if (!submenuResponse.data.data || submenuResponse.data.data.length === 0) {
        toast.info('No category headers found')
        setSubmenuItems([])
      } else {
        setSubmenuItems(submenuResponse.data.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
      setAvailableCategories([])
      setSubmenuItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/getsubcategories/${categoryId}`)
      setSubcategories(response.data.subCategories || [])
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast.error('Failed to load subcategories')
    }
  }

  const fetchSubSubcategories = async (subcategoryId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/getsubsubcategories/${subcategoryId}`)
      setSubSubcategories(response.data.subSubCategories || [])
    } catch (error) {
      console.error('Error fetching sub-subcategories:', error)
      toast.error('Failed to load sub-subcategories')
    }
  }

  const fetchSubSubSubcategories = async (subSubcategoryId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/getsubsubsubcategories/${subSubcategoryId}`)
      setSubSubSubcategories(response.data.subSubSubCategories || [])
    } catch (error) {
      console.error('Error fetching sub-sub-subcategories:', error)
      toast.error('Failed to load sub-sub-subcategories')
    }
  }

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedCategoryId(categoryId)
    await fetchSubcategories(categoryId)
    setSubSubcategories([])
    setSubSubSubcategories([])
  }

  const handleSubcategoryChange = async (subcategoryId) => {
    setSelectedCategoryId(subcategoryId)
    await fetchSubSubcategories(subcategoryId)
    setSubSubSubcategories([])
  }

  const handleSubSubcategoryChange = async (subSubcategoryId) => {
    setSelectedCategoryId(subSubcategoryId)
    await fetchSubSubSubcategories(subSubcategoryId)
  }

  const handleSubSubSubcategoryChange = (subSubSubcategoryId) => {
    setSelectedCategoryId(subSubSubcategoryId)
  }

  const addMobileCategoryHeader = async () => {
    if (!selectedCategoryId) {
      toast.error('Please select a category')
      return
    }

    try {
      const response = await axios.post('https://backend.gezeno.in/api/mobileCategoryHeader', {
        categoryId: selectedCategoryId
      })
      setSubmenuItems(prev => [...prev, response.data.data])
      setSelectedCategory('')
      setSelectedCategoryId('')
      toast.success('Category header added successfully')
    } catch (error) {
      console.error('Error adding category header:', error)
      toast.error('Failed to add category header')
    }
  }

  const editMobileCategoryHeader = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/editMobileCategoryHeader/${id}`, {
        categoryId: selectedCategoryId
      })
      await fetchData()
      setIsEditModalOpen(false)
      setEditingItem(null)
      setSelectedCategoryId('')
      toast.success('Category header updated successfully')
    } catch (error) {
      console.error('Error updating category header:', error)
      toast.error('Failed to update category header')
    }
  }

  const deleteMobileCategoryHeader = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/mobileCategoryHeader/${id}`)
      setSubmenuItems(prev => prev.filter(item => item._id !== id))
      toast.success('Category header deleted successfully')
    } catch (error) {
      console.error('Error deleting category header:', error)
      toast.error('Failed to delete category header')
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Toaster position="top-right" />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
          Mobile Category Headers
        </h1>

        <Card className="shadow-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Category Headers</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <div className="p-4 space-y-4">
                {submenuItems.length > 0 ? (
                  submenuItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.categoryData?.name || item.categoryId?.name || 'Unknown Category'}</p>
                        <p className="text-sm text-gray-500">{item.categoryType}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingItem(item)
                            setIsEditModalOpen(true)
                          }}
                          className="h-8 w-8 text-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMobileCategoryHeader(item._id)}
                          className="h-8 w-8 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                    <p className="text-lg font-medium">No category headers found</p>
                    <p className="text-sm">Add a new category header to get started</p>
                  </div>
                )}
              </div>
              <ScrollBar />
            </ScrollArea>

            <div className="mt-4 space-y-4">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.length > 0 ? (
                    availableCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">No categories available</div>
                  )}
                </SelectContent>
              </Select>

              {subcategories.length > 0 && (
                <Select onValueChange={handleSubcategoryChange}>
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

              {subSubcategories.length > 0 && (
                <Select onValueChange={handleSubSubcategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subSubcategories.map((subSubcategory) => (
                      <SelectItem key={subSubcategory._id} value={subSubcategory._id}>
                        {subSubcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {subSubSubcategories.length > 0 && (
                <Select onValueChange={handleSubSubSubcategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-sub-subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subSubSubcategories.map((subSubSubcategory) => (
                      <SelectItem key={subSubSubcategory._id} value={subSubSubcategory._id}>
                        {subSubSubcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                onClick={() => addMobileCategoryHeader()}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white"
              >
                Add Category Header
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category Header</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {subcategories.length > 0 && (
              <Select onValueChange={handleSubcategoryChange}>
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

            {subSubcategories.length > 0 && (
              <Select onValueChange={handleSubSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subSubcategories.map((subSubcategory) => (
                    <SelectItem key={subSubcategory._id} value={subSubcategory._id}>
                      {subSubcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {subSubSubcategories.length > 0 && (
              <Select onValueChange={handleSubSubSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-sub-subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subSubSubcategories.map((subSubSubcategory) => (
                    <SelectItem key={subSubSubcategory._id} value={subSubSubcategory._id}>
                      {subSubSubcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={() => editMobileCategoryHeader(editingItem._id)}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

