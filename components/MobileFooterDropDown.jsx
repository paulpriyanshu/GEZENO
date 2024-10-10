'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Footer from './Footer'

export default function MobileFooterDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-white border-t border-gray-200 mb-16">
      <div className="p-4">
        <button
          onClick={handleToggle}
          className={`flex items-center justify-between w-full ${isOpen ? 'text-cyan-400' : ''}`}
        >
          <h2 className="text-lg font-semibold">More About Gezeno</h2>
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-cyan-400" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </button>
        {isOpen && (
          <div className="mt-4">
            <Footer />
          </div>
        )}
      </div>
    </div>
  )
}