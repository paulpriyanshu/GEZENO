"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Loader2 } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function EcommerceLayout() {
  const [activeTab, setActiveTab] = useState(null)
  const [activeSubCategory, setActiveSubCategory] = useState(null)
  const [tabs, setTabs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const router=useRouter()
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get("https://backend.gezeno.in/api/mobileCategoryHeader")
      setTabs(response.data.data)
      if (response.data.data.length > 0) {
        const firstTab = response.data.data[0]
        setActiveTab(firstTab)
        if (firstTab.categoryId.subCategories.length > 0) {
          setActiveSubCategory(firstTab.categoryId.subCategories[0])
        }
      }
    } catch (error) {
      console.error("Error while fetching categories", error)
      setError("Failed to fetch categories. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    if (tab?.categoryId?.subCategories?.length > 0) {
      setActiveSubCategory(tab.categoryId.subCategories[0])
    } else {
      setActiveSubCategory(null)
    }
  }

  const handleSubCategoryClick = (subCategory) => {
    setActiveSubCategory(subCategory)
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
      </div>
    )
  }

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
            onClick={() => handleTabClick(tab)}
          >
            {tab.categoryId.name}
            {activeTab?._id === tab._id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" aria-hidden="true"></span>
            )}
          </button>
        ))}
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 bg-gray-100 overflow-y-auto md:p-4">
          {activeTab?.categoryId?.subCategories?.map((subCategory) => (
            <button
              key={subCategory._id}
              className={`w-full text-left  md:px-4 py-2 md:py-3 mb-2  ${
                activeSubCategory?._id === subCategory._id
                  ? "bg-white text-cyan-700"
                  : "bg-slate-100 text-gray-700 "
              }`}
              onClick={() => handleSubCategoryClick(subCategory)}
            >
              <span className="font-medium text-sm md:text-base">{subCategory.name}</span>
            </button>
          ))}
        </aside>
        <main className="w-2/3 overflow-y-auto p-2 md:p-4 bg-white">
          {!activeSubCategory && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg md:text-xl font-semibold mb-2">No categories available</p>
              <p className="text-xs md:text-base">This subcategory doesn &apos; t have any sub-subcategories</p>
            </div>
          )}
          {activeSubCategory && (
            <>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {activeSubCategory.subSubCategories.map((subSubCategory) => (
                  <div key={subSubCategory._id} className="text-center">
                    <div className="bg-white rounded-xl mb-2 md:mb-3 overflow-hidden shadow-md" onClick={()=>router.push(`/category/${encodeURIComponent(subSubCategory.name)}/${subSubCategory._id}`)}>
                      <img
                        src={subSubCategory.image || "/placeholder.svg"}
                        alt={subSubCategory.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-40 md:h-48"
                      />
                    </div>
                    <p className="text-sm md:text-base font-medium text-gray-800">{subSubCategory.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
