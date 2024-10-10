"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Tag, Layers, Grid, Award, ChevronRight, Package } from 'lucide-react'

const menuItems = [
  { icon: Grid, label: 'All Products' },
  { icon: Tag, label: 'Categories' },
  { icon: Layers, label: 'Sub-categories' },
  { icon: Award, label: 'Brands' },
]

const subItems = {
  'All Products': ['Collections', 'Inventory', 'Purchase orders', 'Transfers', 'Gift cards'],
  'Categories': ['Apparel', 'Electronics', 'Home & Garden', 'Sports & Outdoors'],
  'Sub-categories': ['T-shirts', 'Smartphones', 'Kitchen Appliances', 'Fitness Equipment'],
  'Brands': ['Nike', 'Apple', 'Samsung', 'Adidas'],
}

export default function ProductsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center text-base font-medium text-gray-900">
          <Package className="w-5 h-5 mr-3" />
          Products
        </span>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-90' : ''}`} />
      </button>

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
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <button
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                    onClick={() => setActiveItem(activeItem === item.label ? null : item.label)}
                    aria-expanded={activeItem === item.label}
                  >
                    <span className="flex items-center">
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${activeItem === item.label ? 'transform rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeItem === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50"
                      >
                        {subItems[item.label].map((subItem, subIndex) => (
                          <a
                            key={subItem}
                            href="#"
                            className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                            role="menuitem"
                          >
                            {subItem}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}