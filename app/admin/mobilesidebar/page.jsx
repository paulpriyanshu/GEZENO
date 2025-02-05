'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
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
import { Input } from "@/components/ui/Input"
import { GripVertical, Plus, Trash2, Loader2, ChevronDown, Edit } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminPage() {
  // ... (keep existing state and functions for menu items)

  // New state for category management
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [subsubcategories, setSubsubcategories] = useState([])
  const [subsubsubcategories, setSubsubsubcategories] = useState([])

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState('')
  const [selectedSubsubsubcategory, setSelectedSubsubsubcategory] = useState('')

  const [newCategoryName, setNewCategoryName] = useState('')
  const [isSavingCategory, setIsSavingCategory] = useState(false)

  // ... (keep existing useEffect and functions)

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('https://backend.gezeno.in/api/getOnlyCategories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
      setSubsubcategories(response.data.subSubCategories || [])
    } catch (error) {
      console.error('Error fetching sub-subcategories:', error)
      toast.error('Failed to load sub-subcategories')
    }
  }

  const fetchSubSubSubcategories = async (subSubcategoryId) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/getsubsubsubcategories/${subSubcategoryId}`)
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

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setIsSavingCategory(true)
    try {
      const response = await axios.post('https://backend.gezeno.in/api/addcategory', {
        name: newCategoryName,
        parentId: selectedSubsubsubcategory || selectedSubsubcategory || selectedSubcategory || selectedCategory || null
      })

      toast.success('Category added successfully')
      setNewCategoryName('')
      fetchCategories()
      if (selectedCategory) fetchSubcategories(selectedCategory)
      if (selectedSubcategory) fetchSubSubcategories(selectedSubcategory)
      if (selectedSubsubcategory) fetchSubSubSubcategories(selectedSubsubcategory)
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Failed to add category')
    } finally {
      setIsSavingCategory(false)
    }
  }

  // ... (keep existing JSX for menu items section)

  return (
    <div className="container mx-auto py-8 px-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* Existing Menu Items Section */}
      {/* ... */}

      {/* New Mobile Category Management Section */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Mobile Category Management</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="flex space-x-2">
              <Input
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button 
                onClick={addCategory} 
                className="bg-slate-700 hover:bg-slate-800 text-white"
                disabled={isSavingCategory}
              >
                {isSavingCategory ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px] mt-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <span>{category.name}</span>
                  <div>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Existing Edit Dialog */}
      {/* ... */}
    </div>
  )
}