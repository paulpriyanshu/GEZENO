"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const DropDownMenu = () => {
  const router = useRouter();

  const handleNavigation = () => {
    // Navigate to the /category page
    router.push('/category');
  };

  return (
    <div className='relative  w-full'> 
      <div className="absolute z-10  mt-2 bg-white shadow-lg w-2/3 ">
      <div className="container mx-auto">
        <div className='border-b border-slate-200 p-10'>
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-3">Action Figures & Collectibles</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Jackets</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 font-semibold" onClick={handleNavigation}>Dresses <span className="text-red-500 text-xs">SALE</span></a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Cardigans & Pullovers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Skirts</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Pants & Shorts</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Outerwear</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Swimwear</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Art Craft & Hobby Kits</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Jackets</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 font-semibold" onClick={handleNavigation}>Dresses <span className="text-red-500 text-xs">SALE</span></a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Cardigans & Pullovers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Skirts</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Pants & Shorts</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Outerwear</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Swimwear</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Kids Gadgets</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Jackets</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Dresses</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Blouses & Tops</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Cardigans & Pullovers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 font-semibold" onClick={handleNavigation}>Skirts <span className="text-red-500 text-xs">SALE</span></a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Pants & Shorts</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Outerwear</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Remote Control Toys</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Jackets</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Dresses</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Blouses & Tops</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Cardigans & Pullovers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 font-semibold" onClick={handleNavigation}>Skirts <span className="text-red-500 text-xs">SALE</span></a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Pants & Shorts</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900" onClick={handleNavigation}>Outerwear</a></li>
            </ul>
          </div>
          <div>
          <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-srcset="images/32306.webp" class="fade-up lazyloaded" alt="" srcset="images/32306.webp"/>
          </div>
        </div>
        </div>
        <div className="mt-6 flex justify-center p-5 pb-4">
          
          <a href="#" className=" hover:text-slate-800" onClick={handleNavigation}>View All Toys & Games →</a>
        </div>
      </div>
    </div>


    </div>
      );
};

export default DropDownMenu;
