"use client"
import React from 'react';
import Head from 'next/head';

import { Caramel } from 'next/font/google';
import NavBar from '@/components/NavBar';



// Sidebar component for filters
const Sidebar = () => (
  <aside className="w-64">
    <h2 className="font-bold mb-4">FILTERS</h2>
    <button className="text-blue-500 mb-4">Clear All</button>
    {['Category', 'Sizes', 'Brand', 'Colors', 'Ratings', 'Design', 'Fit', 'Sleeve', 'Neck', 'Type', 'Offers', 'Discount', 'Sort By'].map(filter => (
      <div key={filter} className="mb-4">
        <h3 className="font-semibold mb-2">{filter}</h3>
        <button className="flex items-center justify-between w-full">
          <span>{filter}</span>
          <span>▼</span>
        </button>
      </div>
    ))}
  </aside>
);

// Product card component
const ProductCard = ({ image, title, price }) => (
  <div className="bg-white rounded shadow">
    <img src={image} alt={title} width={300} height={400} className="w-full" />
    <div className="p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600">{price}</p>
    </div>
  </div>
);

// Main page component
const Category = () => {
  return (
    <div>
    <NavBar/>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="/">Home</a>
          <span>/</span>
          <span>Category</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Sports & Games (639)</h1>

        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-8">
            <div className="flex justify-between items-center mb-6">
              <span>SORT BY:</span>
              <select className="border rounded px-2 py-1">
                <option>Popular</option>
                {/* Add other sorting options */}
              </select>
            </div>

            <div className="mb-8">
              <img src="/banner.jpg" alt="Print-Perfect Pajamas" width={1200} height={400} className="w-full rounded" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <ProductCard image="/product1.jpg" title="Meow T-Shirt" price="₹599" />
              <ProductCard image="/product1.jpg" title="Meow T-Shirt" price="₹599" />
              <ProductCard image="/product1.jpg" title="Meow T-Shirt" price="₹599" />
              {/* Add more ProductCard components as needed */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Category;