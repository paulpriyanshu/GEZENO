"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Loader2, MoreHorizontal, X, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EcommerceLayout() {
  const [activeTab, setActiveTab] = useState(null)
  const [activeSidebar, setActiveSidebar] = useState("Topwear")
  const [tabs, setTabs] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [filters, setFilters] = useState({})
  const [activeFilters, setActiveFilters] = useState({})
  const [expandedFilters, setExpandedFilters] = useState({})

  useEffect(() => {
    fetchTabs()
  }, [])

  useEffect(() => {
    if (activeTab) {
      fetchProducts(activeTab.categoryId)
    }
  }, [activeTab])

  useEffect(() => {
    filterProducts()
  }, [products, activeFilters])

  const fetchTabs = async () => {
    try {
      const response = await axios.get("https://backend.gezeno.in/api/mobileCategoryHeader")
      setTabs(response.data.data)
      if (response.data.data.length > 0) {
        setActiveTab(response.data.data[0])
      }
    } catch (error) {
      console.error("Error while fetching mobile category headers", error)
      setError("Failed to fetch categories. Please try again later.")
    }
  }

  const fetchProducts = async (categoryId) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/productOfCategory/${categoryId}`)
      setProducts(response.data.products)
      console.log(response.data)
      const newFilters = {}
      response.data.products.forEach((product) => {
        if (product.filters) {
          product.filters.forEach((filter) => {
            if (!newFilters[filter.filter.name]) {
              newFilters[filter.filter.name] = new Set()
            }
            filter.tags.forEach((tag) => newFilters[filter.filter.name].add(tag))
          })
        }
        if (product.sizes) {
          if (!newFilters["Sizes"]) {
            newFilters["Sizes"] = new Set()
          }
          product.sizes.forEach((size) => {
            size.tags.forEach((tag) => newFilters["Sizes"].add(tag))
          })
        }
      })
      setFilters(newFilters)
      setExpandedFilters(Object.keys(newFilters).reduce((acc, key) => ({ ...acc, [key]: false }), {}))
    } catch (error) {
      console.error("Error while fetching products", error)
      setError("Failed to fetch products. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      for (const [filterName, selectedTags] of Object.entries(activeFilters)) {
        if (selectedTags.length > 0) {
          if (filterName === "Sizes") {
            const productSizes = product.sizes?.flatMap((size) => size.tags) || []
            if (!selectedTags.some((tag) => productSizes.includes(tag))) {
              return false
            }
          } else {
            const productTags = product.filters?.flatMap((filter) => filter.tags) || []
            if (!selectedTags.some((tag) => productTags.includes(tag))) {
              return false
            }
          }
        }
      }
      return true
    })
    setFilteredProducts(filtered)
  }

  const toggleFilter = (filterName, tag) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      if (!newFilters[filterName]) {
        newFilters[filterName] = []
      }
      const index = newFilters[filterName].indexOf(tag)
      if (index > -1) {
        newFilters[filterName] = newFilters[filterName].filter((t) => t !== tag)
      } else {
        newFilters[filterName] = [...newFilters[filterName], tag]
      }
      if (newFilters[filterName].length === 0) {
        delete newFilters[filterName]
      }
      return newFilters
    })
  }

  const toggleExpandFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  const trimProductName = (name) => {
    const words = name.split(" ")
    if (words.length > 5) {
      return words.slice(0, 5).join(" ") + "..."
    }
    return name
  }
  const router = useRouter()
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-center space-x-4 md:space-x-8 py-2 md:py-4 border-b relative" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab._id}
            role="tab"
            aria-selected={activeTab?._id === tab._id}
            className={`font-semibold pb-2 md:pb-4 w-1/3 text-xs md:text-base ${
              activeTab?._id === tab._id ? "text-cyan-400" : "text-gray-600"
            } hover:text-cyan-400 transition-colors relative`}
            onClick={() => {
              setActiveTab(tab)
              setActiveSidebar("Topwear")
              setActiveFilters({})
            }}
          >
            {tab.categoryData.name}
            {activeTab?._id === tab._id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" aria-hidden="true"></span>
            )}
          </button>
        ))}
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 bg-gray-100 overflow-y-auto p-2 md:p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
          {Object.entries(filters).map(([filterName, tags]) => (
            <div key={filterName} className="mb-2 md:mb-4 bg-white rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-2 md:px-4 py-1 md:py-2 bg-gray-100  focus:outline-none"
                onClick={() => toggleExpandFilter(filterName)}
                aria-expanded={expandedFilters[filterName]}
              >
                <span className="font-semibold text-gray-700 text-xs md:text-base">{filterName}</span>
                <ChevronDown
                  className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${
                    expandedFilters[filterName] ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFilters[filterName] && (
                <div className="p-1 md:p-2">
                  {Array.from(tags).map((tag) => (
                    <label key={tag} className="flex items-center p-1 md:p-2 hover:bg-gray-100 rounded">
                      <input
                        type="checkbox"
                        checked={activeFilters[filterName]?.includes(tag) || false}
                        onChange={() => toggleFilter(filterName, tag)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-gray-300 rounded-sm mr-2 flex items-center justify-center peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-colors">
                        {activeFilters[filterName]?.includes(tag) && (
                          <svg
                            className="w-2 h-2 md:w-3 md:h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs md:text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>
        <main className="w-2/3 overflow-y-auto p-2 md:p-4 bg-white">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-cyan-400" />
            </div>
          )}
          {error && (
            <p className="text-center text-red-500 bg-red-100 p-2 md:p-4 rounded-md text-xs md:text-base">{error}</p>
          )}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg md:text-xl font-semibold mb-2">No products found</p>
              <p className="text-xs md:text-base">Try adjusting your filters</p>
            </div>
          )}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="text-center">
                  <div className="bg-white rounded-3xl mb-1 md:mb-2 overflow-hidden ">
                    <img
                      src={product.images[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-auto rounded-3xl"
                      onClick={() => router.push(`/products/${product._id}`)}
                    />
                  </div>
                  <div className="relative">
                    <p className="text-xs md:text-sm font-semibold text-gray-800">
                      {trimProductName(product.name)}
                      {product.name.split(" ").length > 5 && (
                        <button
                          onClick={() => setExpandedProduct(product)}
                          className="ml-1 inline-flex items-center text-cyan-500 hover:text-cyan-600"
                          aria-label="Show more details"
                        >
                          <MoreHorizontal className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      )}
                    </p>
                    <p className="text-xxs md:text-xs text-gray-600">₹{product.price.toFixed(2)}</p>
                    {product.sizes && product.sizes.tags?.length > 0 && (
                      <p className="text-xxs md:text-xs text-gray-500 mt-1">Sizes: {product.sizes.tags?.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {expandedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-xs md:max-w-md w-full relative">
            <button
              onClick={() => setExpandedProduct(null)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-gray-500"
              aria-label="Close details"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="flex flex-col justify-between items-start mb-2 md:mb-4 ">
              <img
                src={expandedProduct.images[0]?.url || "/placeholder.svg"}
                alt={expandedProduct.name}
                width={200}
                height={200}
                className="object-cover w-full h-auto mb-2 md:mb-4 "
              />
              <h3 className="text-sm md:text-lg font-semibold text-gray-900">{expandedProduct.name}</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-100 mb-1 md:mb-2">₹{expandedProduct.price.toFixed(2)}</p>
            {expandedProduct.filters && (
              <div className="mt-2 md:mt-4">
                <h4 className="text-xs md:text-sm font-semibold mb-1 md:mb-2">Filters:</h4>
                <p className="text-xxs md:text-xs">
                  {expandedProduct.filters?.filter?.name}: {expandedProduct.filters?.tags.join(", ")}
                </p>
              </div>
            )}
            {expandedProduct.sizes && expandedProduct.sizes.tags && (
              <div className="mt-2 md:mt-4">
                <h4 className="text-xs md:text-sm font-semibold mb-1 md:mb-2">Sizes:</h4>
                <p className="text-xxs md:text-xs">{expandedProduct.sizes.tags.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

