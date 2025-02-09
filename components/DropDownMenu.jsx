'use client'

import React from 'react'

export default function DropDownMenu({ category }) {
  if (!category || !category.subCategories) return null
  // console.log("this is drop down ",category)
  const SaleBadge = ({ type = 'default' }) => {
    const styles = {
      default: 'bg-pink-500 text-white',
      black: 'bg-black text-white',
      blue: 'bg-cyan-400 text-white'
    }

    return (
      <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded ${styles[type]}`}>
        SALE
      </span>
    )
  }

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-x-12">
          {category.subCategories.map((subCategory, index) => (
            <div key={subCategory?._id} className="space-y-4">
              <a className="text-gray-700 hover:text-teal-300 font-medium text-base"  href={`https://www.gezeno.com/category/${subCategory?._id}`} >
                {subCategory.name}
              </a>
              <ul className="space-y-3">
                {subCategory.subSubCategories &&
                  subCategory.subSubCategories.map((subSubCategory, id) => (
                    <li key={subSubCategory?.name}>
                      <a 
                        href={`https://www.gezeno.com/category/${subSubCategory?._id}`} 
                        className="inline-flex items-center text-gray-500 hover:text-teal-400 hover:underline text-[15px] font-normal"
                      >
                        {subSubCategory?.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a 
             href={`https://www.gezeno.com/category/${category?._id}`} 
            className="inline-flex items-center text-gray-600 hover:text-teal-400 text-lg font-medium"
          >
            View All {category.name}
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

