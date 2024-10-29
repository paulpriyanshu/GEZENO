'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Tag, Grid, Award, ChevronRight, Package, Plus, Check, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { toggleSidebar } from '@/app/lib/store/features/adminsidebar/SideBarSlice'

const menuItems = [
  { icon: Grid, label: 'All Products', route: '/admin/products' },
  { icon: Tag, label: 'Categories', route: '/admin/categories' },
  { icon: Award, label: 'Brands', route: '/admin/brands' },
]

export default function ProductsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)
  const [categoriesError, setCategoriesError] = useState(null)
  const [brandsError, setBrandsError] = useState(null)
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [newSubCategoryInput, setNewSubCategoryInput] = useState('')
  const [newSubSubCategoryInput, setNewSubSubCategoryInput] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [addingSubCategory, setAddingSubCategory] = useState(null)
  const [addingSubSubCategory, setAddingSubSubCategory] = useState(null)
  const router = useRouter()
  const dispatch=useDispatch()

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) return

    setIsLoadingCategories(true)
    setCategoriesError(null)

    try {
      const response = await axios.get('http://backend.gezeno.com/api/categories')
      
      if (!response.data || !response.data.success || !Array.isArray(response.data.categories)) {
        throw new Error('Invalid response format')
      }

      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategoriesError('Failed to load categories. Please try again.')
    } finally {
      setIsLoadingCategories(false)
    }
  }, [categories.length])

  const fetchBrands = useCallback(async () => {
    if (brands.length > 0) return

    setIsLoadingBrands(true)
    setBrandsError(null)

    try {
      const response = await axios.get('http://backend.gezeno.com/api/getallbrands')
      
      if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response format')
      }

      setBrands(response.data.data)
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrandsError('Failed to load brands. Please try again.')
    } finally {
      setIsLoadingBrands(false)
    }
  }, [brands.length])

  const handleItemClick = (item, route) => {
    router.push(route)
    setIsOpen(false)
    setActiveItem(null)
    setActiveCategoryIndex(null)
    dispatch(toggleSidebar());
  }

  const toggleSubMenu = async (label) => {
    if (label === 'Brands') {
      router.push('/admin/brands')
      setIsOpen(false)
      setActiveItem(null)
      dispatch(toggleSidebar());
    } else if (label === 'Categories' && categories.length === 0) {
      await fetchCategories()
      setActiveItem(activeItem === label ? null : label)
      setActiveCategoryIndex(null)
    }
  }

  const toggleCategorySubMenu = (index) => {
    setActiveCategoryIndex(activeCategoryIndex === index ? null : index)
    setAddingSubCategory(null)
    setAddingSubSubCategory(null)
  }

  const handleAddCategory = async () => {
    if (newCategoryInput.trim()) {
      const newCategory = {
        _id: Date.now().toString(),
        name: newCategoryInput,
        subCategories: []
      }

      setCategories(prevCategories => [...prevCategories, newCategory])
      setNewCategoryInput('')
      setAddingCategory(false)

      try {
        const response = await axios.post('http://backend.gezeno.com/api/createcategory', {
          name: newCategoryInput
        })
        if (response.data && response.data.success) {
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat._id === newCategory._id ? { ...cat, _id: response.data.category._id } : cat
            )
          )
        } else {
          console.error('Failed to add category')
          setCategories(prevCategories => prevCategories.filter(cat => cat._id !== newCategory._id))
        }
      } catch (error) {
        console.error('Error adding category:', error)
        setCategories(prevCategories => prevCategories.filter(cat => cat._id !== newCategory._id))
      }
    }
  }

  const handleAddSubCategory = async (categoryId) => {
    if (newSubCategoryInput.trim()) {
      const newSubCategory = {
        _id: Date.now().toString(),
        name: newSubCategoryInput,
        subSubCategories: []
      }

      setCategories(prevCategories => 
        prevCategories.map(category => 
          category._id === categoryId 
            ? { ...category, subCategories: [...category.subCategories, newSubCategory] }
            : category
        )
      )
      setNewSubCategoryInput('')
      setAddingSubCategory(null)

      try {
        const category = categories.find(c => c._id === categoryId)
        if (!category) return

        const response = await axios.post('http://backend.gezeno.com/api/createsubcategory', {
          name: newSubCategoryInput,
          categoryName: category.name
        })
        if (response.data && response.data.success) {
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat._id === categoryId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map(subCat => 
                      subCat._id === newSubCategory._id ? { ...subCat, _id: response.data.subCategory._id } : subCat
                    )
                  }
                : cat
            )
          )
        } else {
          console.error('Failed to add subcategory')
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat._id === categoryId
                ? { ...cat, subCategories: cat.subCategories.filter(subCat => subCat._id !== newSubCategory._id) }
                : cat
            )
          )
        }
      } catch (error) {
        console.error('Error adding subcategory:', error)
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat._id === categoryId
              ? { ...cat, subCategories: cat.subCategories.filter(subCat => subCat._id !== newSubCategory._id) }
              : cat
          )
        )
      }
    }
  }

  const handleAddSubSubCategory = async (categoryId, subCategoryId) => {
    if (newSubSubCategoryInput.trim()) {
      const newSubSubCategory = {
        _id: Date.now().toString(),
        name: newSubSubCategoryInput
      }

      setCategories(prevCategories => 
        prevCategories.map(category => 
          category._id === categoryId 
            ? {
                ...category,
                subCategories: category.subCategories.map(subCategory =>
                  subCategory._id === subCategoryId
                    ? { ...subCategory, subSubCategories: [...subCategory.subSubCategories, newSubSubCategory] }
                    : subCategory
                )
              }
            : category
        )
      )
      setNewSubSubCategoryInput('')
      setAddingSubSubCategory(null)

      try {
        const category = categories.find(c => c._id === categoryId)
        const subCategory = category?.subCategories.find(sc => sc._id === subCategoryId)
        if (!category || !subCategory) return

        const response = await axios.post('http://backend.gezeno.com/api/createsubsubcategory', {
          name: newSubSubCategoryInput,
          categoryName: category.name,
          subCategoryName: subCategory.name
        })
        if (response.data && response.data.success) {
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat._id === categoryId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map(subCat => 
                      subCat._id === subCategoryId
                        ? {
                            ...subCat,
                            subSubCategories: subCat.subSubCategories.map(subSubCat => 
                              subSubCat._id === newSubSubCategory._id ? { ...subSubCat, _id: response.data.subSubCategory._id } : subSubCat
                            )
                          }
                        : subCat
                    )
                  }
                : cat
            )
          )
        } else {
          console.error('Failed to add sub-subcategory')
          setCategories(prevCategories => 
            prevCategories.map(cat => 
              cat._id === categoryId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map(subCat => 
                      subCat._id === subCategoryId
                        ? { ...subCat, subSubCategories: subCat.subSubCategories.filter(subSubCat => subSubCat._id !== newSubSubCategory._id) }
                        : subCat
                    )
                  }
                : cat
            )
          )
        }
      } catch (error) {
        console.error('Error adding sub-subcategory:', error)
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat._id === categoryId
              ? {
                  ...cat,
                  subCategories: cat.subCategories.map(subCat => 
                    subCat._id === subCategoryId
                      ? { ...subCat, subSubCategories: subCat.subSubCategories.filter(subSubCat => subSubCat._id !== newSubSubCategory._id) }
                      : subCat
                  )
                }
              : cat
          )
        )
      }
    }
  }

  const handleDeleteCategory = async (categoryName) => {
    try {
      const response = await axios.post(`http://backend.gezeno.com/api/deletecategory/${categoryName}`)
      if (response.data && response.data.success) {
        setCategories(prevCategories => prevCategories.filter(cat => cat.name !== categoryName))
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  return (
    <div className="w-full">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center text-base font-medium text-gray-900">
          <Package className="w-5 h-5 mr-3" />
          Products
        </span>
        <ChevronRight className={`w-5 h-5 text-black transition-transform duration-200 ${isOpen ? 'transform rotate-90' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white rounded-md shadow-sm mt-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.label === 'All Products' ? (
                    <Button
                      variant="ghost"
                      className="flex items-center w-full px-4 py-2 text-sm text-black hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                      onClick={() => handleItemClick(item.label, item.route)}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-black hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                        onClick={() => toggleSubMenu(item.label)}
                        aria-expanded={activeItem === item.label}
                      >
                        <span className="flex items-center">
                          <item.icon className="w-5 h-5 mr-2" />
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-black transition-transform duration-200 ${activeItem === item.label ? 'transform rotate-180' : ''}`}
                        />
                      </Button>
                      <AnimatePresence>
                        {activeItem === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0  }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50"
                          >
                            {item.label === 'Categories' && isLoadingCategories ? (
                              <div className="p-4">
                                <Skeleton className="w-full h-4 mb-2" />
                                <Skeleton className="w-full h-4 mb-2" />
                                <Skeleton className="w-full h-4" />
                              </div>
                            ) : item.label === 'Categories' && categoriesError ? (
                              <div className="p-4 text-red-500">{categoriesError}</div>
                            ) : item.label === 'Brands' && isLoadingBrands ? (
                              <div className="p-4">
                                <Skeleton className="w-full h-4 mb-2" />
                                <Skeleton className="w-full h-4 mb-2" />
                                <Skeleton className="w-full h-4" />
                              </div>
                            ) : item.label  === 'Brands' && brandsError ? (
                              <div className="p-4 text-red-500">{brandsError}</div>
                            ) : (
                              <>
                                {(item.label === 'Categories' ? categories : brands).map((subItem, index) => (
                                  <div key={subItem._id}>
                                    <div className="flex items-center justify-between">
                                      <Button
                                        variant="ghost"
                                        className="w-full text-left px-8 py-2 text-sm text-black hover:bg-gray-200 transition-colors duration-200"
                                        onClick={() => {
                                          if (item.label === 'Categories') {
                                            toggleCategorySubMenu(index)
                                          } else {
                                            handleItemClick(subItem.name, `/admin/${item.label.toLowerCase()}/${subItem.name.toLowerCase()}`)
                                          }
                                        }}
                                      >
                                        {subItem.name}
                                        {subItem.commingSoon && <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>}
                                        {item.label === 'Categories' && subItem.subCategories && subItem.subCategories.length > 0 && (
                                          <ChevronDown
                                            className={`w-4 h-4 text-black transition-transform duration-200 ${activeCategoryIndex === index ? 'transform rotate-180' : ''}`}
                                          />
                                        )}
                                      </Button>
                                      <div className="flex items-center">
                                        {item.label === 'Categories' && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mr-2 hover:bg-gray-200 transition-colors duration-200"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setAddingSubCategory(subItem._id)
                                              setActiveCategoryIndex(index)
                                            }}
                                          >
                                            <Plus className="w-4 h-4" />
                                          </Button>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="mr-2 hover:bg-gray-200 transition-colors duration-200"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteCategory(subItem.name)
                                          }}
                                        >
                                          <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                      </div>
                                    </div>
                                    {item.label === 'Categories' && (
                                      <>
                                        {activeCategoryIndex === index && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-gray-100"
                                          >
                                            {subItem.subCategories && subItem.subCategories.map((subcategory) => (
                                              <div key={subcategory._id}>
                                                <div className="flex items-center justify-between">
                                                  <Button
                                                    variant="ghost"
                                                    className="w-full text-left px-12 py-2 text-sm text-black hover:bg-gray-200 transition-colors duration-200"
                                                    onClick={() => handleItemClick(subcategory.name, `/admin/subcategories/${subcategory.name.toLowerCase()}`)}
                                                  >
                                                    {subcategory.name}
                                                    {subcategory.commingSoon && <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>}
                                                  </Button>
                                                  <div className="flex items-center">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="mr-2 hover:bg-gray-200 transition-colors duration-200"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        setAddingSubSubCategory(subcategory._id)
                                                      }}
                                                    >
                                                      <Plus className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="mr-2 hover:bg-gray-200 transition-colors duration-200"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        // Add delete subcategory logic here when API is provided
                                                      }}
                                                    >
                                                      <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                  </div>
                                                </div>
                                                {subcategory.subSubCategories && subcategory.subSubCategories.map((subSubCategory) => (
                                                  <div key={subSubCategory._id} className="flex items-center justify-between">
                                                    <Button
                                                      variant="ghost"
                                                      className="w-full text-left px-16 py-2 text-xs text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                                                      onClick={() => handleItemClick(subSubCategory.name, `/admin/subsubcategories/${subSubCategory.name.toLowerCase()}`)}
                                                    >
                                                      {subSubCategory.name}
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="mr-2 hover:bg-gray-200 transition-colors duration-200"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        // Add delete sub-subcategory logic here when API is provided
                                                      }}
                                                    >
                                                      <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                  </div>
                                                ))}
                                                {addingSubSubCategory === subcategory._id && (
                                                  <div className="flex items-center px-16 py-2">
                                                    <Input
                                                      type="text"
                                                      value={newSubSubCategoryInput}
                                                      onChange={(e) => setNewSubSubCategoryInput(e.target.value)}
                                                      placeholder="New sub-subcategory"
                                                      className="mr-2"
                                                    />
                                                    <Button
                                                      size="sm"
                                                      onClick={() => handleAddSubSubCategory(subItem._id, subcategory._id)}
                                                      className="bg-green-500 hover:bg-green-600 text-white"
                                                    >
                                                      <Check className="w-4 h-4" />
                                                    </Button>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                            {addingSubCategory === subItem._id && (
                                              <div className="flex items-center px-12 py-2">
                                                <Input
                                                  type="text"
                                                  value={newSubCategoryInput}
                                                  onChange={(e) => setNewSubCategoryInput(e.target.value)}
                                                  placeholder="New subcategory"
                                                  className="mr-2"
                                                />
                                                <Button
                                                  size="sm"
                                                  onClick={() => handleAddSubCategory(subItem._id)}
                                                  className="bg-green-500 hover:bg-green-600 text-white"
                                                >
                                                  <Check className="w-4 h-4" />
                                                </Button>
                                              </div>
                                            )}
                                          </motion.div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                ))}
                                {item.label === 'Categories' && (
                                  <>
                                    {addingCategory ? (
                                      <div className="flex items-center px-8 py-2">
                                        <Input
                                          type="text"
                                          value={newCategoryInput}
                                          onChange={(e) => setNewCategoryInput(e.target.value)}
                                          placeholder="New category"
                                          className="mr-2"
                                        />
                                        <Button
                                          size="sm"
                                          onClick={handleAddCategory}
                                          className="bg-green-500 hover:bg-green-600 text-white"
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        className="w-full text-left px-8 py-2 text-sm text-black hover:bg-gray-200 transition-colors duration-200"
                                        onClick={() => setAddingCategory(true)}
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Category
                                      </Button>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}