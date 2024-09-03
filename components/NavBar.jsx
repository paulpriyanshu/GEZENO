"use client"
import React, { useEffect } from 'react'
import SearchBar from './SearchBar'
import Cookies from 'js-cookie'
import { useState } from 'react'
function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [allcookies,setallcookies]=useState([])
  const [username,setName]=useState("")
  const [useremail,setEmail]=useState("")

  const getCookies=async()=>{
    const authToken=await Cookies.get("token");
    const name=await Cookies.get("name");
    const email=await Cookies.get("email")
    setName(name)
    setEmail(email)



  }
  useEffect(()=>{
    getCookies()
  },[])
  const toggleDropdown = () => {
    console.log("this is the cookies email",useremail,username)
    setIsOpen((prev)=>!prev);
  };
  return (  
    <div>      
      <div className='flex justify-between md:justify-center w-full border-slate-200 border-b'>
        <div className="py-4 px-5 flex justify-center">
          <img src='hamburger.svg' alt='menu logo' className='mr-2 md:hidden'/>
          <img src="logo.webp" alt="Gezeno Logo" className='w-20 md:w-28'/>
          <div className="flex items-center space-x-4 lg:space-x-8">
  <nav className="hidden lg:flex space-x-4 lg:space-x-6 mx-2 lg:mx-5">    
    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">TOYS & GAMES</a>
    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">BOYS FASHION</a>
    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm lg:mr-20">GIRLS FASHION</a>
  </nav>
</div>

        </div>
        <div className="flex items-center space-x-6">
          <div className="relative w-80 ml-10 hidden md:block">
            <svg className="absolute left-3 top-4 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className='w-96'>
              <SearchBar/>
            </div>
          </div>
          <button className='block w-5 md:block'>
          <img src='search.png' width={20}/>
            
          </button>
          <div className="relative inline-block group">
      <button className='p-2'>   
        {getCookies ? (
          <img src='user.png' alt="User" className="w-4 md:w-6 lg:w-6 min-w-[15px]"/>
        ) : (
          <div className='font-extralight'>Login</div>
        )}
      </button>
      <div className="z-10 absolute left-1/2 transform -translate-x-1/2 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-center" role="menuitem">Hi</a>
          <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-center" role="menuitem">My Account</a>
          <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-center" role="menuitem">My Wishlist</a>
          <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-center" role="menuitem">My Orders</a>
          <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-center" role="menuitem">Logout</a>
        </div>
      </div>
    </div>
          <button className="text-gray-600 hover:text-gray-900">
            <img src='heart.png' className="w-4 md:w-6 lg:w-6 min-w-[15px]"/>
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <img src="ic-web-head-cart.svg" className="w-6 md:w-8 lg:w-8 min-w-[15px]"/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar
