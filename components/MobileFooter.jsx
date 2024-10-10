'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUpDown, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Component() {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState('New')
  const [selectedFilters, setSelectedFilters] = useState([])
  const filterModalRef = useRef(null)

  const sortOptions = [
    { label: 'Popular', value: 'Popular' },
    { label: 'New', value: 'New' },
    { label: 'Price: Low to High', value: 'PriceLowToHigh' },
    { label: 'Price: High to Low', value: 'PriceHighToLow' },
  ]

  const filterCategories = [
    { name: 'Category', options: ['Same Day Delivery', 'Next Day Delivery'] },
    { name: 'Sizes', options: ['S', 'M', 'L', 'XL'] },
    { name: 'Brand', options: ['Brand A', 'Brand B', 'Brand C'] },
    { name: 'Color', options: ['Red', 'Blue', 'Green', 'Black'] },
    { name: 'Design', options: ['Solid', 'Patterned', 'Striped'] },
    { name: 'Fit', options: ['Regular', 'Slim', 'Loose'] },
    { name: 'Sleeve', options: ['Short', 'Long', 'Sleeveless'] },
    { name: 'Neck', options: ['Round', 'V-neck', 'Collar'] },
    { name: 'Type', options: ['T-shirt', 'Shirt', 'Sweater'] },
  ]

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearAllFilters = () => {
    setSelectedFilters([])
  }

  useEffect(() => {
    if (isFilterOpen && filterModalRef.current) {
      filterModalRef.current.style.height = `${window.innerHeight * 0.9}px`
    }
  }, [isFilterOpen])

  return (
    <div className="relative min-h-screen">
      {/* Content area */}


      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center md:hidden">
        <button
          className="flex-1 flex flex-col items-center text-sm font-medium text-gray-600"
          onClick={() => setIsSortOpen(true)}
        >
          <div className="flex items-center justify-center w-full">
            <ArrowUpDown className="w-4 h-4 mr-2 text-cyan-500" />
            <span>Sort</span>
          </div>
          <span className="text-xs text-cyan-500">{selectedSort}</span>
        </button>
        <div className="w-px h-8 bg-gray-200 mx-2"></div>
        <button
          className="flex-1 flex flex-col items-center text-sm font-medium text-gray-600"
          onClick={() => setIsFilterOpen(true)}
        >
          <div className="flex items-center justify-center w-full">
            <Filter className="w-4 h-4 mr-2 text-cyan-500" />
            <span>Filters</span>
          </div>
          <span className="text-xs text-cyan-500">
            {selectedFilters.length > 0 ? `${selectedFilters.length} selected` : 'All'}
          </span>
        </button>
      </div>

      {/* Desktop Sort and Filter Options */}
      <div className="hidden md:block md:fixed md:top-0 md:right-0 md:w-64 md:p-4 md:bg-white md:border-l md:border-gray-200 md:h-full md:overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Sort by</h2>
        <div className="space-y-2 mb-6">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedSort === option.value
                  ? 'bg-cyan-100 text-cyan-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedSort(option.value)}
            >
              {option.label}
              {selectedSort === option.value && (
                <span className="float-right text-cyan-600">•</span>
              )}
            </button>
          ))}
        </div>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          {filterCategories.map((category) => (
            <div key={category.name}>
              <h3 className="font-medium mb-2">{category.name}</h3>
              <div className="space-y-2">
                {category.options.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-cyan-600"
                      checked={selectedFilters.includes(option)}
                      onChange={() => toggleFilter(option)}
                    />
                    <span className="ml-2 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sort Modal */}
      <AnimatePresence>
        {isSortOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg md:hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Sort by</h2>
                <button onClick={() => setIsSortOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left py-2 px-4 rounded-lg ${
                      selectedSort === option.value
                        ? 'bg-cyan-100 text-cyan-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedSort(option.value)
                      setIsSortOpen(false)
                    }}
                  >
                    {option.label}
                    {selectedSort === option.value && (
                      <span className="float-right text-cyan-600">•</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            ref={filterModalRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-lg md:hidden overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={clearAllFilters} className="text-cyan-600 text-sm">
                    Clear All
                  </button>
                </div>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {filterCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="font-medium mb-2">{category.name}</h3>
                    <div className="space-y-2">
                      {category.options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-cyan-600 rounded"
                            checked={selectedFilters.includes(option)}
                            onChange={() => toggleFilter(option)}
                          />
                          <span className="ml-2">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className=" border-t border-gray-200 bg-white flex justify-between">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-1/2 py-2 px-4 border border-gray-300  text-gray-700"
                >
                  CLOSE
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-1/2 py-2 px-4 bg-cyan-500 text-white "
                >
                  APPLY
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}