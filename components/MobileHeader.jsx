"use client"
import React, { useEffect, useState } from 'react';
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
// import { arrayBuffer } from 'stream/consumers';

const initialFilterItems = [
   "T-Shirts" ,
   "Size",
   "Top Rated" ,
   "Regular Fit" ,
   "Graphics" ,
   "Half Sleeves" ,
   "Long Sleeves" ,
   "Solids" ,
   "Color",
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


export default function Header({filters}) {
  // const [filterItems, setFilterItems] = useState(initialFilterItems.map(item => ({...item, active: false})));
  const [filterArray,setFilterArray]=useState([])
  function concatenateArrays(obj) {
    const result = [];
    
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        // Concatenate the array value into the result
        result.push(...obj[key]);
      }
    }
    
    return result;
  }
  useEffect(()=>{
    setFilterArray(concatenateArrays(filters))
    // console.log("this is the array",array)
  },[])
 
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
        {filterArray?.map((item, index) => (
          <button
            key={item}
            onClick={() => toggleActive(index)}
            className={`px-2 py-1 text-[10px] sm:text-xs font-semibold border border-slate-300 rounded-full whitespace-nowrap flex items-center justify-center w-full ${
              item.active ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            <span className="truncate">{item}</span>
            {/* {item.hasDropdown && <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />} */}
          </button>
        ))}
      </Carousel>
    </header>
  );
}