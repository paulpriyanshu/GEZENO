import React, { useState } from 'react';
import Link from "next/link";
import {
  ChevronLeft,
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const initialFilterItems = [
  { name: "T-Shirts", hasDropdown: false },
  { name: "Size", hasDropdown: true },
  { name: "Top Rated", hasDropdown: false },
  { name: "Regular Fit", hasDropdown: false },
  { name: "Graphics", hasDropdown: false },
  { name: "Half Sleeves", hasDropdown: false },
  { name: "Long Sleeves", hasDropdown: false },
  { name: "Solids", hasDropdown: false },
  { name: "Color", hasDropdown: true },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 4,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 3,
    slidesToSlide: 1,
  },
};

export default function Header() {
  const [filterItems, setFilterItems] = useState(initialFilterItems.map(item => ({...item, active: false})));

  const toggleActive = (index) => {
    setFilterItems(prevItems => 
      prevItems.map((item, i) => 
        i === index ? {...item, active: !item.active} : item
      )
    );
  };

  return (
    <header className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link href="#" className="mr-2">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-semibold">T-shirts for Men</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-6 h-6" />
          <Heart className="w-6 h-6" />
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">1898 items</p>
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        itemClass="px-1"
      >
        {filterItems.map((item, index) => (
          <button
            key={item.name}
            onClick={() => toggleActive(index)}
            className={`px-2 py-1 text-[10px] sm:text-xs font-semibold border border-slate-300 rounded-full whitespace-nowrap flex items-center justify-center w-full ${
              item.active ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            <span className="truncate">{item.name}</span>
            {item.hasDropdown && <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />}
          </button>
        ))}
      </Carousel>
    </header>
  );
}