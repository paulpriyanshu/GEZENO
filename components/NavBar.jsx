import React from 'react'
import SearchBar from './SearchBar'

function NavBar() {
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
        <div className="flex items-center space-x-8">
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
          <button className='hidden md:block'>   
            <img src='user.png' className="w-4 md:w-6 lg:w-6 min-w-[15px]"/>
          </button>
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
