'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { GripVertical, Plus, Trash2, Loader2, ImageIcon, ChevronDown, Upload, X, Edit } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { Progress } from "@/components/ui/progress"
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function HomePageEditor() {
  const [homeData, setHomeData] = useState({
    headers: [],
    carousel: [],
    // secondaryCarousel: [],
    // thirdCarousel: [],
    // fourthCarousel: [],
    banners: [],
    customSections: [],
    ourBestPicks: [],
    tooHotToBeMissed: [],
    gezenoOriginals: [],
    widgets: []
  })
  const [availableCategories, setAvailableCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editUploadProgress, setEditUploadProgress] = useState(0)
  const [isEditUploading, setIsEditUploading] = useState(false)
  const [newBannerUrl, setNewBannerUrl] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const [newCustomSection, setNewCustomSection] = useState({ name: '', categoryId: '' })
  const [newHeaderCategory, setNewHeaderCategory] = useState('')
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const scrollAreaRefs = useRef([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewImage, setPreviewImage] = useState(null)
  const [editingBanner, setEditingBanner] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [carouselSelections, setCarouselSelections] = useState({
    carousel: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    // secondaryCarousel: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    // thirdCarousel: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    // fourthCarousel: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    customSections: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    ourBestPicks: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    tooHotToBeMissed: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    gezenoOriginals: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
    widgets: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' },
  })

  const [subcategories, setSubcategories] = useState({})
  const [subSubcategories, setSubSubcategories] = useState({})
  const [subSubSubcategories, setSubSubSubcategories] = useState({})

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [categoriesResponse, homeDataResponse] = await Promise.all([
        axios.get('https://backend.gezeno.in/api/products/getOnlyCategories'),
        axios.get('https://backend.gezeno.in/api/home/config')
      ])
      const categories = categoriesResponse.data
      setAvailableCategories(categories)

      const homeData = homeDataResponse.data.data
      // console.log("this is home data",homeDataResponse.data.data)
      const updatedCarousel = homeData.carousel.map(item => ({
        ...item,
        categoryName: item.categoryData?.name || "Unknown",
      }))
      // homeData.customSections.map((item)=>{
      //   console.log("this one is custom section",item.categoryData?.name)
      // })
      const updatedCustomSections = homeData.customSections.map(item => ({
        ...item,
        categoryName: item.categoryData?.name || "Unknown",
      }))
      const updatedWidgets = homeData.widgets.map(item => ({
        ...item,
        categoryName: item.categoryData?.name || "Unknown",
      }))
      const updatedGezenoUpdated = homeData.gezenoOriginals.map(item => ({
        ...item,
        categoryName: item.categoryData?.name || "Unknown",
      }))
      const updatedTooHot = homeData.tooHotToBeMissed.map(item => ({
        ...item,
        categoryName: item.categoryData?.name || "Unknown",
      }))
      const updatedBestPicks = homeData.ourBestPicks.map(item => ({
        ...item,
        categoryName: item.categoryData?.name || "Unknown",
      }))
      
      const updatedHomeData = {
        ...homeData,
        headers: homeData.headers.map(header => ({
          ...header,
          categoryName: categories.find(cat => cat._id === header.categoryId._id)?.name || 'Unknown'
        })),
        carousel: updatedCarousel,
        // secondaryCarousel: homeData.secondarycarousel?.map(item => ({
        //   ...item,
        //   categoryName: categories.find(cat => cat._id === item.categoryId._id)?.name || 'Unknown'
        // })),
        // thirdCarousel: homeData.thirdcarousel?.map(item => ({
        //   ...item,
        //   categoryName: categories.find(cat => cat._id === item.categoryId._id)?.name || 'Unknown'
        // })),
        // fourthCarousel: homeData.fourthcarousel?.map(item => ({
        //   ...item,
        //   categoryName: categories.find(cat => cat._id === item.categoryId._id)?.name || 'Unknown'
        // })),
        customSections: updatedCustomSections,
        ourBestPicks: updatedBestPicks,
        tooHotToBeMissed: updatedTooHot,
        gezenoOriginals : updatedGezenoUpdated,
        widgets: updatedWidgets
      }
      setHomeData(updatedHomeData)

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

    const { source, destination, type } = result
    let updatedData = { ...homeData }

    const listMap = {
      carousel: 'carousel',
      // secondaryCarousel: 'secondaryCarousel',
      // thirdCarousel: 'thirdCarousel',
      // fourthCarousel: 'fourthCarousel',
      customSection: 'customSections',
      ourBestPicks: 'ourBestPicks',
      tooHotToBeMissed: 'tooHotToBeMissed',
      gezenoOriginals: 'gezenoOriginals',
      widgets: 'widgets'
    }

    if (listMap[type]) {
      const items = Array.from(homeData[listMap[type]])
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)
      updatedData[listMap[type]] = items
    }

    setHomeData(updatedData)
  }

  const fetchSubcategories = async (categoryId, stateKey) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/products/getsubcategories/${categoryId}`)
      setSubcategories(prev => ({ ...prev, [stateKey]: response.data }))
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast.error('Failed to load subcategories')
    }
  }

  const fetchSubSubcategories = async (subcategoryId, stateKey) => {
    try {
      // console.log("fetching subsubcategories",subcategoryId)
      const response = await axios.get(`https://backend.gezeno.in/api/products/getsubsubcategories/${subcategoryId}`)
      setSubSubcategories(prev => ({ ...prev, [stateKey]: response.data }))
    } catch (error) {
      console.error('Error fetching sub-subcategories:', error)
      toast.error('Failed to load sub-subcategories')
    }
  }

  const fetchSubSubSubcategories = async (subSubcategoryId, stateKey) => {
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/products/getsubsubsubcategories/${subSubcategoryId}`)
      setSubSubSubcategories(prev => ({ ...prev, [stateKey]: response.data }))
    } catch (error) {
      console.error('Error fetching sub-sub-subcategories:', error)
      toast.error('Failed to load sub-sub-subcategories')
    }
  }

  const handleCategoryChange = (categoryId, stateKey) => {
    setCarouselSelections(prev => ({
      ...prev,
      [stateKey]: { category: categoryId, subcategory: '', subSubcategory: '', subSubSubcategory: '' }
    }))
    fetchSubcategories(categoryId, stateKey)
  }

  const handleSubcategoryChange = (subcategoryId, stateKey) => {
    setCarouselSelections(prev => ({
      ...prev,
      [stateKey]: { ...prev[stateKey], subcategory: subcategoryId, subSubcategory: '', subSubSubcategory: '' }
    }))
    fetchSubSubcategories(subcategoryId, stateKey)
  }

  const handleSubSubcategoryChange = (subSubcategoryId, stateKey) => {
    setCarouselSelections(prev => ({
      ...prev,
      [stateKey]: { ...prev[stateKey], subSubcategory: subSubcategoryId, subSubSubcategory: '' }
    }))
    fetchSubSubSubcategories(subSubcategoryId, stateKey)
  }

  const handleSubSubSubcategoryChange = (subSubSubcategoryId, stateKey) => {
    setCarouselSelections(prev => ({
      ...prev,
      [stateKey]: { ...prev[stateKey], subSubSubcategory: subSubSubcategoryId }
    }))
  }

  const addCarouselCategory = async (endpoint, stateKey) => {
    const selection = carouselSelections[stateKey]
    let categoryToAdd = selection.category
    if (selection.subSubSubcategory) {
      categoryToAdd = selection.subSubSubcategory
    } else if (selection.subSubcategory) {
      categoryToAdd = selection.subSubcategory
    } else if (selection.subcategory) {
      categoryToAdd = selection.subcategory
    }

    if (!categoryToAdd) {
      toast.error('Please select a category')
      return
    }

    try {
      // if(stateKey==='customSections') {
      //   addCustomSection()

      // }
      // console.log(endpoint)
      // console.log(categoryToAdd)
      const response = await axios.post(`https://backend.gezeno.in/api/${endpoint}`, {
        categoryId: categoryToAdd
      })
      const categoryName = getCategoryName(categoryToAdd, stateKey)
      setHomeData(prev => ({
        ...prev,
        [stateKey]: [...prev[stateKey], { ...response.data.data, categoryName }]
      }))
      resetCategorySelection(stateKey)
      toast.success('Item added successfully.')
    } catch (error) {
      console.error(`Error adding ${stateKey} item:`, error)
      toast.error(`Failed to add ${stateKey} item. Please try again.`)
    }
  }

  const removeCarouselCategory = async (endpoint, id, stateKey) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/${endpoint}/${id}`)
      setHomeData(prev => ({
        ...prev,
        [stateKey]: prev[stateKey].filter(item => item._id !== id)
      }))
      toast.success('Item removed successfully.')
    } catch (error) {
      console.error(`Error removing ${stateKey} item:`, error)
      toast.error(`Failed to remove ${stateKey} item. Please try again.`)
    }
  }

  const addBanner = async (url, redirectUrl) => {
    if (!url) {
      toast.error('Please enter a banner URL')
      return
    }
    try {
      const response = await axios.post('https://backend.gezeno.in/api/banner', { url, redirectUrl })
      setHomeData(prev => ({
        ...prev,
        banners: [...prev.banners, response.data.data]
      }))
      setNewBannerUrl('')
      setRedirectUrl('')
      setPreviewImage(null)
      toast.success('Banner added successfully.')
    } catch (error) {
      console.error('Error adding banner:', error)
      toast.error('Failed to add banner. Please try again.')
    }
  }

  const removeBanner = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/deletebanner/${id}`)
      setHomeData(prev => ({
        ...prev,
        banners: prev.banners.filter(banner => banner._id !== id)
      }))
      toast.success('Banner removed successfully.')
    } catch (error) {
      console.error('Error removing banner:', error)
      toast.error('Failed to remove banner. Please try again.')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
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
      setNewBannerUrl(previewResponse.data.url)
      setPreviewImage(previewResponse.data.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error in image upload:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // const addCustomSection = async () => {
  //   console.log("custom section entered")
  //   console.log(newCustomSection)
  //   if (!newCustomSection.name || !newCustomSection.categoryId) {
  //     toast.error('Please enter a section name and select a category')
  //     return
  //   }
    
  //   console.log("this is new custom name",newCustomSection.name)
  //   try {
     
  //     const response = await axios.post('https://backend.gezeno.in/api/customSections', {
  //       sectionName: newCustomSection.name,
  //       categoryId: newCustomSection.categoryId
  //     })
  //     const categoryName = availableCategories.find(cat => cat._id === newCustomSection.categoryId)?.name || 'Unknown'
  //     setHomeData(prev => ({
  //       ...prev,
  //       customSections: [...prev.customSections, { ...response.data.data, categoryName }]
  //     }))
  //     setNewCustomSection({ name: '', categoryId: '' })
  //     toast.success('Custom section added successfully.')
  //   } catch (error) {
  //     console.error('Error adding custom section:', error)
  //     toast.error('Failed to add custom section. Please try again.')
  //   }
  // }

  const removeCustomSection = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/custom-section/${id}`)
      setHomeData(prev => ({
        ...prev,
        customSections: prev.customSections.filter(section => section._id !== id)
      }))
      toast.success('Custom section removed successfully.')
    } catch (error) {
      console.error('Error removing custom section:', error)
      toast.error('Failed to remove custom section. Please try again.')
    }
  }

  const addHeader = async () => {
    if (!newHeaderCategory) {
      toast.error('Please select a category for the header')
      return
    }
    try {
      const response = await axios.post('https://backend.gezeno.in/api/header', {
        categoryId: newHeaderCategory
      })
      const categoryName = availableCategories.find(cat => cat._id === newHeaderCategory)?.name || 'Unknown'
      setHomeData(prev => ({
        ...prev,
        headers: [...prev.headers, { ...response.data.data, categoryName }]
      }))
      setNewHeaderCategory('')
      toast.success('Header added successfully.')
    } catch (error) {
      console.error('Error adding header:', error)
      toast.error('Failed to add header. Please try again.')
    }
  }

  const removeHeader = async (id) => {
    try {
      await axios.post(`https://backend.gezeno.in/api/header/${id}`)
      setHomeData(prev => ({
        ...prev,
        headers: prev.headers.filter(header => header._id !== id)
      }))
      toast.success('Header removed successfully.')
    } catch (error) {
      console.error('Error removing header:', error)
      toast.error('Failed to remove header. Please try again.')
    }
  }

  const getCategoryName = (categoryId, stateKey) => {
    const category = availableCategories.find(cat => cat._id === categoryId)
    const subcategory = subcategories[stateKey]?.subCategories?.find(subcat => subcat._id === categoryId)
    const subSubcategory = subSubcategories[stateKey]?.subSubCategories?.find(subSubcat => subSubcat._id === categoryId)
    const subSubSubcategory = subSubSubcategories[stateKey]?.subSubSubcategories?.find(subSubSubcat => subSubSubcat._id === categoryId)
    return subSubSubcategory?.name || subSubcategory?.name || subcategory?.name || category?.name || 'Unknown'
  }

  const resetCategorySelection = (stateKey) => {
    setCarouselSelections(prev => ({
      ...prev,
      [stateKey]: { category: '', subcategory: '', subSubcategory: '', subSubSubcategory: '' }
    }))
    setSubcategories(prev => ({ ...prev, [stateKey]: [] }))
    setSubSubcategories(prev => ({ ...prev, [stateKey]: [] }))
    setSubSubSubcategories(prev => ({ ...prev, [stateKey]: [] }))
  }

  const handleScroll = (index) => {
    const scrollArea = scrollAreaRefs.current[index]
    if (scrollArea) {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea
      setShowScrollIndicator(scrollTop < 20)
    }
  }

  const renderScrollArea = (content, index) => (
    <div className="relative">
      <ScrollArea 
        className="h-[200px] w-full rounded-md border"
        ref={el => scrollAreaRefs.current[index] = el}
        onScroll={() => handleScroll(index)}
      >
        {content}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {showScrollIndicator && (
        <div 
          className="absolute inset-x-0 bottom-0 flex justify-center items-center h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none transition-opacity duration-300"
          style={{ opacity: showScrollIndicator ? 1 : 0 }}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center animate-bounce">
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      )}
    </div>
  )

  const renderCategorySelects = (stateKey) => {
    const selection = carouselSelections[stateKey];
  
    return (
      <div className="flex flex-col gap-2">
        {/* Main Category Select */}
        {console.log(homeData)}
        {/* {console.log(stateKey)} */}
      {/* {stateKey==='customSections' && (
        <Input
        value={newCustomSection.name}
        onChange={(e) => setNewCustomSection({ ...newCustomSection, name: e.target.value })}
        placeholder="Enter section name"
        className="text-sm"
      />
      
      )} */}

        <Select
          value={selection.category}
          onValueChange={(value) => {
            handleCategoryChange(value, stateKey);
            if (stateKey === 'customSections') {
              setNewCustomSection((prev) => ({ ...prev, categoryId: value }));
            }
          }}
        >
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
  
        {/* {console.log("These are the subcategories", subcategories[stateKey])} */}
        {/* {console.log("stateKey:", stateKey)} */}
  
        {/* Subcategory Select */}
        <div>
          <Select
            value={selection.subcategory}
            onValueChange={(value) => {
              handleSubcategoryChange(value, stateKey);
              if (stateKey === 'customSections') {
                setNewCustomSection((prev) => ({ ...prev, categoryId: value })); // Overwrite with subcategory ID
              }
            }}
            disabled={!Array.isArray(subcategories[stateKey]?.subCategories) || subcategories[stateKey]?.subCategories?.length === 0}
          >
            <SelectTrigger className={!subcategories[stateKey]?.subCategories?.length ? "opacity-50 cursor-not-allowed" : ""}>
              <SelectValue
                placeholder={
                  subcategories[stateKey]?.subCategories?.length > 0 ? "Select subcategory" : "No subcategories available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(subcategories[stateKey]?.subCategories) ? (
                subcategories[stateKey]?.subCategories?.map((subcategory) => (
                  <SelectItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </SelectItem>
                ))
              ) : (
                <p className="text-gray-500 text-sm mt-2">No valid subcategories available</p>
              )}
            </SelectContent>
          </Select>
        </div>
  
        {/* Sub-subcategory Select */}
        {subSubcategories[stateKey]?.subSubCategories?.length > 0 && (
          <Select
            value={selection.subSubcategory}
            onValueChange={(value) => {
              handleSubSubcategoryChange(value, stateKey);
              if (stateKey === 'customSections') {
                setNewCustomSection((prev) => ({ ...prev, categoryId: value })); // Overwrite with sub-subcategory ID
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subSubcategories[stateKey]?.subSubCategories?.map((subSubcategory) => (
                <SelectItem key={subSubcategory._id} value={subSubcategory._id}>
                  {subSubcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
  
        {/* Sub-sub-subcategory Select */}
        {subSubSubcategories[stateKey]?.subSubSubCategories?.length > 0 && (
          <Select
            value={selection.subSubSubcategory}
            onValueChange={(value) => {
              handleSubSubSubcategoryChange(value, stateKey);
              if (stateKey === 'customSections') {
                setNewCustomSection((prev) => ({ ...prev, categoryId: value })); // Overwrite with sub-sub-subcategory ID
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-sub-subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subSubSubcategories[stateKey]?.subSubSubCategories.map((subSubSubcategory) => (
                <SelectItem key={subSubSubcategory._id} value={subSubSubcategory._id}>
                  {subSubSubcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
  
        {/* Add Button */}
        <Button
          onClick={() => addCarouselCategory(getEndpoint(stateKey), stateKey)}
          className="bg-slate-700 hover:bg-slate-800 text-white"
        >
          Add to {stateKey}
        </Button>
      </div>
    );
  };

  const getEndpoint = (stateKey) => {
    const endpointMap = {
      carousel: 'carousel',
      // secondaryCarousel: 'secondarycarousel',
      // thirdCarousel: 'thirdcarousel',
      // fourthCarousel: 'fourthcarousel',
      customSections: 'customSections',
      ourBestPicks: 'ourbestpicks',
      tooHotToBeMissed: 'toohottobemissed',
      gezenoOriginals: 'gezenooriginals',
      widgets: 'widgets'
    }
    return endpointMap[stateKey] || stateKey
  }

  const renderCarouselSection = (title, stateKey, categorySelects, index) => (
    <Card className="shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Droppable droppableId={stateKey} type={stateKey}>
          {(provided) => (
            renderScrollArea(
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 p-2">
                {homeData[stateKey] && homeData[stateKey].length > 0 ? (
                  homeData[stateKey].map((item, index) => (
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
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {item.categoryName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCarouselCategory(getEndpoint(stateKey), item._id, stateKey)}
                            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No items available</p>
                )}
                {provided.placeholder}
              </div>,
              index
            )
          )}
        </Droppable>
        <div className="mt-4">
          {categorySelects}
        </div>
      </CardContent>
    </Card>
  )

  const editBanner = async (id, url, redirectUrl) => {
    try {
      const response = await axios.post(`https://backend.gezeno.in/api/banner/${id}`, { url, redirectUrl })
      const updatedBanner = response.data.data
      setHomeData(prevData => ({
        ...prevData,
        banners: prevData.banners.map(banner => 
          banner._id === id ? updatedBanner : banner
        )
      }))
      setEditingBanner(null)
      setIsEditModalOpen(false)
      setNewBannerUrl('')
      setRedirectUrl('')
      setPreviewImage(null)
      toast.success('Banner updated successfully.')
    } catch (error) {
      console.error('Error updating banner:', error)
      toast.error('Failed to update banner. Please try again.')
    }
  }

  const handleEditBanner = (banner) => {
    setEditingBanner(banner)
    setNewBannerUrl(banner.url)
    setRedirectUrl(banner.redirectUrl || '')
    setPreviewImage(banner.url)
    setIsEditModalOpen(true)
  }

  const handleRemoveImage = () => {
    if (window.confirm('Are you sure you want to remove this image? This action cannot be undone.')) {
      setPreviewImage(null)
      setNewBannerUrl('')
    }
  }

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsEditUploading(true)
    setEditUploadProgress(0)
    
    try {
      const uploadUrlResponse = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`)
      const { url, filename } = uploadUrlResponse.data

      await axios.put(url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setEditUploadProgress(percentCompleted)
        }
      })

      const previewResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`)
      setNewBannerUrl(previewResponse.data.url)
      setPreviewImage(previewResponse.data.url)
      
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error in image upload:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsEditUploading(false)
      setEditUploadProgress(0)
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
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Home Page Editor</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow-lg col-span-1">
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Headers</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {renderScrollArea(
                  <div className="space-y-2 p-2">
                    {homeData.headers && homeData.headers.length > 0 ? (
                      homeData.headers.map((header) => (
                        <div key={header._id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm transition-all hover:shadow-md">
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              Category: {header.categoryName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHeader(header._id)}
                            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No headers available</p>
                    )}
                  </div>,
                  0
                )}
                <div className="flex items-center gap-2 mt-4">
                  <Select value={newHeaderCategory} onValueChange={setNewHeaderCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map(category => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addHeader} className="bg-slate-700 hover:bg-slate-800 text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {renderCarouselSection("Main Carousel", "carousel", renderCategorySelects("carousel"), 1)}
            {/* {renderCarouselSection("Secondary Carousel", "secondaryCarousel", renderCategorySelects("secondaryCarousel"), 2)}
            {renderCarouselSection("Third Carousel", "thirdCarousel", renderCategorySelects("thirdCarousel"), 3)}
            {renderCarouselSection("Fourth Carousel", "fourthCarousel", renderCategorySelects("fourthCarousel"), 4)} */}

            <Card className="shadow-lg col-span-1">
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Banners</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {renderScrollArea(
                  <div className="space-y-2 p-2">
                    {homeData.banners && homeData.banners.length > 0 ? (
                      homeData.banners.map((banner) => (
                        <div key={banner?._id || Math.random()} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm transition-all hover:shadow-md">
                          <ImageIcon className="h-4 w-4 text-gray-500" />
                          <div className="flex-grow overflow-hidden">
                            <p className="truncate text-xs text-gray-600 dark:text-gray-400">{banner?.url || 'No URL'}</p>
                            {banner?.redirectUrl && (
                              <p className="truncate text-xs text-gray-500 dark:text-gray-400">Redirect: {banner.redirectUrl}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditBanner(banner)}
                            className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBanner(banner._id)}
                            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No banners available</p>
                    )}
                  </div>,
                  5
                )}
                <div className="flex flex-col gap-2 mt-4">
                  <input
                    type="file"
                    id="banner-upload"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="h-6 w-6 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload Image</span>
                  </label>
                  {isUploading && (
                    <div className="mt-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress.toFixed(0)}%</p>
                    </div>
                  )}
                  {previewImage && (
                    <div className="mt-2 relative">
                      <Image src={previewImage} alt="Banner preview" width={300} height={150} className="rounded-md" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 h-6 w-6 bg-white text-gray-600 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Input
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    placeholder="Enter banner URL"
                    className="text-sm"
                  />
                  <Input
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="Enter redirect URL"
                    className="text-sm"
                  />
                  <Button 
                    onClick={() => addBanner(newBannerUrl, redirectUrl)} 
                    className="bg-slate-700 hover:bg-slate-800 text-white"
                    disabled={!newBannerUrl}
                  >
                    Save Banner
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg col-span-1">
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Custom Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Droppable droppableId="customSections" type="customSection">
                  {(provided) => (
                    renderScrollArea(
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 p-2">
                        {homeData.customSections && homeData.customSections.length > 0 ? (
                          homeData.customSections.map((section, index) => (
                            <Draggable key={section._id} draggableId={section._id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm transition-all hover:shadow-md"
                                >
                                  <GripVertical className="h-4 w-4 text-gray-500" />
                                  <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{section.sectionName}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                      Category: {section.categoryName}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCustomSection(section._id)}
                                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No custom sections available</p>
                        )}
                        {provided.placeholder}
                      </div>,
                      6
                    )
                  )}
                </Droppable>
                <div className="mt-4">
                  {renderCategorySelects("customSections")}
                </div>
              </CardContent>
            </Card>

            {renderCarouselSection("Our Best Picks", "ourBestPicks", renderCategorySelects("ourBestPicks"), 7)}
            {renderCarouselSection("Too Hot To Be Missed", "tooHotToBeMissed", renderCategorySelects("tooHotToBeMissed"), 8)}
            {renderCarouselSection("Gezeno Originals", "gezenoOriginals", renderCategorySelects("gezenoOriginals"), 9)}
            {renderCarouselSection("Widgets", "widgets", renderCategorySelects("widgets"), 10)}
          </div>
        </DragDropContext>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {previewImage && (
              <div className="relative">
                <Image src={previewImage} alt="Banner preview" width={300} height={150} className="rounded-md" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 h-6 w-6 bg-white text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <input
              type="file"
              id="edit-banner-upload"
              onChange={handleEditImageUpload}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="edit-banner-upload"
              className="flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
            >
              <Upload className="h-6 w-6 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600">Upload New Image</span>
            </label>
            {isEditUploading && (
              <div className="mt-2">
                <Progress value={editUploadProgress} className="w-full" />
                <p className="text-sm text-gray-600 mt-1">Uploading: {editUploadProgress.toFixed(0)}%</p>
              </div>
            )}
            <Input
              value={newBannerUrl}
              onChange={(e) => setNewBannerUrl(e.target.value)}
              placeholder="Enter banner URL"
              className="text-sm"
            />
            <Input
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="Enter redirect URL"
              className="text-sm"
            />
            <Button 
              onClick={() => editBanner(editingBanner._id, newBannerUrl, redirectUrl)}
              className="bg-slate-700 hover:bg-slate-800 text-white"
              disabled={!newBannerUrl}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}