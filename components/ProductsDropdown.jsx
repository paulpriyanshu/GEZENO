'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Package, Grid, Tag, Layers, Grid3X3, Award, Puzzle, Filter, Maximize, Box, Square, Shirt } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useDispatch } from 'react-redux'
import { toggleSidebar } from '@/app/lib/store/features/adminsidebar/SideBarSlice'
import { AspectRatioIcon, MobileIcon } from '@radix-ui/react-icons'

const menuItems = [
  { icon: Grid, label: 'All Products', route: '/admin/products' },
  { icon: Filter, label: 'Custom Filters', route: '/admin/filters' },
  { icon: Puzzle, label: 'Variants', route: '/admin/variants' },
  { icon: Tag, label: 'Categories', route: '/admin/categories' },
  { icon: Layers, label: 'Subcategories', route: '/admin/subcategories' },
  { icon: Grid, label: 'Subsubcategories', route: '/admin/subsubcategories' },
  { icon: Grid3X3, label: 'Subsubsubcategories', route: '/admin/subsubsubcategories' },
  { icon: Award, label: 'Brands', route: '/admin/brands' },
  { icon: Shirt, label: 'Sizes', route: '/admin/sizes' },
  { icon: Tag,     label:'Offers',  route:'/admin/offers' },
  {icon :MobileIcon ,label:'Mobile', route:'/admin/mobileCategory'}
]

export default function ProductsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleItemClick = (route) => {
    router.push(route)
    setIsOpen(false)
    dispatch(toggleSidebar())
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
                <Button
                  key={item.label}
                  variant="ghost"
                  className="flex justify-start items-center w-full px-4 py-2 text-sm text-black hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  onClick={() => handleItemClick(item.route)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}