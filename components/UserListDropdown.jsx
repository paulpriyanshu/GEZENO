"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, UserCircle, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const userItems = [
  { label: 'All Users', route: 'all' },
  { label: 'Admins', route: 'admins' },
  { label: 'Customers', route: 'customers' },
  { label: 'Vendors', route: 'vendors' },
]

export default function UserListDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (route) => {
    router.push(`/admin/users/${route}`)
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center text-base font-medium text-gray-900">
          <UserCircle className="w-5 h-5 mr-3" />
          User List
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
          >
            <div className="py-1">
              {userItems.map((item, index) => (
                <button
                  key={item.label}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                  onClick={() => handleNavigation(item.route)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}