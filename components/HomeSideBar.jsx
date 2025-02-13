'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toggleSidebar } from '@/app/lib/store/features/homesidebar/HomeSideBarSlice'

// const menuItems = [
//   { name: 'Men', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-icon-men--1--1684748735.png' },
//   { name: 'Women', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-icon-women--1--1684748736.png' },
//   { name: 'Accessories', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-icon-accessories--1--1684748737.png' },
//   { name: 'Bewakoof Sneakers', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-Nav-168x168-sneaker-1718779684.png' },
//   { name: 'Customize with Google AI', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-Nav-168x168-googleai-1718944672.png' },
//   { name: 'Shop by Fandom', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-icon-character-shop--1--1684748738.png' },
//   { name: 'Specials', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-icon-specials-1684824538.png' },
//   { name: 'Customise your own T-Shirt', imgSrc: 'https://images.bewakoof.com/nav_menu/Circle-icon-customisation--1--1684748736.png' },
// ]

export default function HomeSideBar({ isOpen,menuItems}) {
  console.log("menu",menuItems)
  const sidebarRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        dispatch(toggleSidebar())
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, dispatch])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-sans">Welcome Guest</h2>
              <button onClick={() => dispatch(toggleSidebar())}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <a href="#" className="text-gray-400 block mb-6 font-bold">Login / Sign Up</a>
            <div className='border border-b-slate-100 w-full'></div>

            <h3 className="font-bold font-sans mt-5 mb-3 text-gray-400">SHOP IN</h3>
            <nav>
              <ul className="space-y-4">
                {menuItems?.map((item, index) => (
                  <li key={index} className="MenuListOption">
                    <a href={`https://gezeno.in/category/${encodeURIComponent(item.name)}/${item._id}`} className="flex items-center justify-between text-gray-700 hover:text-gray-900 text-sm font-sans font-semibold">
                      <span>{item.name}</span>
                      <img src={item.image} alt={item.name} className="w-5 h-5 navIcon rounded-lg"/>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className='mt-auto bg-gray-100 p-4'>
            <h3 className="font-bold font-sans text-md text-gray-500 mb-4">CONTACT US</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="block text-sm font-sans text-gray-700 hover:text-gray-900">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="#" className="block text-sm text-gray-700 hover:text-gray-900">
                  Feedback & Suggestions
                </a>
              </li>
              <li>
                <a href="#" className="block text-sm text-gray-700 hover:text-gray-900">
                  Become a Seller
                </a>
              </li>
              <li>
                <a href="#" className="block text-sm text-gray-700 hover:text-gray-900">
                  Request a Call
                </a>
              </li>
            </ul>
          </div>

          <div className='p-4 border-t border-gray-200'>
            <h3 className="font-bold text-md text-gray-500 mb-4 font-sans">ABOUT US</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="block text-gray-700 text-sm font-sans hover:text-gray-900">
                  Our Story
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}