"use client"
import { useState } from 'react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleMenu} className="md:hidden p-2">
        <img src="hamburger.svg" alt="Menu Icon" className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold">Welcome Guest</h5>
            <div className="text-sm">
              <a href="#" className="text-blue-500">Login / Sign Up</a>
            </div>
          </div>

          <div className="p-4">
            <p className="text-gray-600 text-xs">SHOP IN</p>
            <ul className="space-y-4">
              <li><a href="#" className="flex items-center space-x-2"><span>Men</span><img src="https://images.bewakoof.com/nav_menu/Circle-icon-men--1--1684748735.png" alt="Men" className="w-6 h-6" /></a></li>
              <li><a href="#" className="flex items-center space-x-2"><span>Women</span><img src="https://images.bewakoof.com/nav_menu/Circle-icon-women--1--1684748736.png" alt="Women" className="w-6 h-6" /></a></li>
              <li><a href="#" className="flex items-center space-x-2"><span>Accessories</span><img src="https://images.bewakoof.com/nav_menu/Circle-icon-accessories--1--1684748737.png" alt="Accessories" className="w-6 h-6" /></a></li>
              {/* Add more items as needed */}
            </ul>
          </div>

          <div className="p-4 bg-gray-100">
            <p className="text-gray-600 text-sm">CONTACT US</p>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-500">Help & Support</a></li>
              <li><a href="#" className="text-blue-500">Feedback & Suggestions</a></li>
              <li><a href="#" className="text-blue-500">Become a Seller</a></li>
              <li><a href="#" className="text-blue-500">Request a Call</a></li>
            </ul>
          </div>

          <div className="p-4">
            <p className="text-gray-600 text-sm">ABOUT US</p>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-500">Our Story</a></li>
              <li><a href="#" className="text-blue-500">Fanbook</a></li>
              <li><a href="#" className="text-blue-500">Blog</a></li>
            </ul>
          </div>
          
          <div className="p-4">
            <ul>
              <li><a href="#" className="text-blue-500">Login</a></li>
            </ul>
          </div>

          <button onClick={toggleMenu} className="absolute top-4 right-4 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
