"use client"
import React from 'react';
import NavBar from '@/components/NavBar';
// import Sidebar from '@/components/SideBar';
import MobileHeader from '@/components/MobileHeader';
import MobileFooter from '@/components/MobileFooter';
import Sidebar from '../../components/SideBar';

const ProductCard = ({ image, title, price }) => (
  <div className="bg-white rounded shadow">
    <img src={image} alt={title} width={300} height={400} className="w-full" />
    <div className="p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600">{price}</p>
    </div>
  </div>
);

const Category = () => {
  return (
    <div>
      <div className='hidden md:block'>
      <NavBar/>
      </div>
      <div className='md:hidden'>
        <MobileHeader/>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="hidden md:block items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="/">Home</a>
          <span>/</span>
          <span>Category</span>
        </div>

        <h1 className="hidden md:block text-3xl font-bold mb-6">Sports & Games (639)</h1>

        <div className="flex">
          <div className="hidden md:block "> {/* Sidebar visible only on small screens */}
            <Sidebar/>
          </div>
          <div className="flex-1 ml-0 md:ml-8"> {/* Adjusts spacing on larger screens */}
            <div className="hidden md:block justify-between items-center mb-6">
              <span>SORT BY:</span>
              <select className="border rounded px-2 py-1">
                <option>Popular</option>
                {/* Add other sorting options */}
              </select>
            </div>

            <div className="mb-8">
              <img src="https://images.bewakoof.com/uploads/category/desktop/INSIDE_DESKTOP_BANNER_pajamas_-1719554491.jpg" width={1200} height={400} alt="category-image" />
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3"> {/* Two columns on small screens */}
              <ProductCard image="https://images.bewakoof.com/t320/women-s-blue-moody-jerry-graphic-printed-oversized-t-shirt-585902-1715257595-1.jpg" title="Meow T-Shirt" price="₹599" />
              <ProductCard image="https://images.bewakoof.com/t320/women-s-blue-moody-jerry-graphic-printed-oversized-t-shirt-585902-1715257595-1.jpg" title="Meow T-Shirt" price="₹599" />
              <ProductCard image="https://images.bewakoof.com/t320/women-s-blue-moody-jerry-graphic-printed-oversized-t-shirt-585902-1715257595-1.jpg" title="Meow T-Shirt" price="₹599" />
              <ProductCard image="https://images.bewakoof.com/t320/women-s-blue-moody-jerry-graphic-printed-oversized-t-shirt-585902-1715257595-1.jpg" title="Meow T-Shirt" price="₹599" />
              <ProductCard image="https://images.bewakoof.com/t320/women-s-blue-moody-jerry-graphic-printed-oversized-t-shirt-585902-1715257595-1.jpg" title="Meow T-Shirt" price="₹599" />
              <ProductCard image="https://images.bewakoof.com/t320/women-s-blue-moody-jerry-graphic-printed-oversized-t-shirt-585902-1715257595-1.jpg" title="Meow T-Shirt" price="₹599" />
            </div>
          </div>
        </div>
      </main>
      <div className='md:hidden'>
      <MobileFooter/>
      </div>
     
    </div>
  );
};

export default Category;
