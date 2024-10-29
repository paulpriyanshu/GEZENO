'use client'

import { useState } from "react"
const tabs = ["Men", "Women", "Accessories"]

const menSidebarCategories = ["Topwear", "Bottomwear", "Top Seller"]
const womenSidebarCategories = [
  "Topwear", "Bottomwear", "Top Seller", "Dresses", "Loungewear",
  "Winterwear", "Accessories", "Plus Size", "Footwear", "Lingerie",
  "Nightwear", "Sportswear", "Beauty", "Bags", "Jewellery"
]

const menTopwearCategories = [
  { name: "T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Tshirt-1719294552.jpg" },
  { name: "Printed T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-2-1716876416.jpg" },
  { name: "Oversized T-shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Oversized-tshirt-1719294558.jpg" },
  { name: "Classic Fit T-shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Classic-tshirt-1719294557.jpg" },
  { name: "Plain T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-6-1716876417.jpg" },
  { name: "Half Sleeve T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Half-sleeve-Tshirt-1719294557.jpg" },
  { name: "Polo T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Polo-Tshirt-1719294556.jpg" },
  { name: "Vests", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Vest-1719294552.jpg" },
  { name: "Full Sleeve T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Full-sleeve-tshirt-1719294557.jpg" },
  { name: "Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Shirts-1719294553.jpg" },
  { name: "Co-ord Sets", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Co-ords-1719294558.jpg" },
  { name: "Customize T-shirts", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-12-1716876415.jpg" },
  { name: "Plus Size Topwear", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-13-1716876415.jpg" },
  { name: "Sweatshirts & Hoodies", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-14-1716876418.jpg" },
  { name: "Sweaters", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-15pg-1716876419.jpg" },
  { name: "Jackets", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-16jpg-1716876419.jpg" },
  { name: "All Topwear", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-View-all--1--1707116393.jpg" },
]

const womenTopwearCategories = [
  { name: "T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Women-1716877734.jpg" },
  { name: "Printed T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Women-Tshirt-1719295397.jpg" },
  { name: "Oversized T-shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Oversized-tshirt-1719294558.jpg" },
  { name: "Classic Fit T-shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Classic-tshirt-1719294557.jpg" },
  { name: "Plain T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Men-6-1716876417.jpg" },
  { name: "Half Sleeve T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Half-sleeve-Tshirt-1719294557.jpg" },
  { name: "Polo T-Shirts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Polo-Tshirt-1719294556.jpg" },
  { name: "Vests", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Vest-1719294552.jpg" },
]

const menBottomwearCategories = [
  { name: "Joggers", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-1-1716964390.jpg" },
  { name: "Jeans", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-2-1716964389.jpg" },
  { name: "Baggy Jeans", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-3--1--1716964390.jpg" },
  { name: "Pajamas", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Pyjamas-1719294554.jpg" },
  { name: "Trousers & Pants", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Trousers-1719294554.jpg" },
  { name: "Cargos", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-6-1716964392.jpg" },
  { name: "Cargo Pants", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-7-1716964393.jpg" },
  { name: "Parachute Pants", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Parachute-pants-1719294555.jpg" },
  { name: "Co-ord Sets", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Co-ords-1719294558.jpg" },
  { name: "Shorts", image: "https://images.bewakoof.com/uploads/grid/app/Bottom-NAV-Men-Shorts-1719294554.jpg" },
  { name: "Boxers", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-10--1--1716964393.jpg" },
  { name: "Combos", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-11-1716964394.jpg" },
  { name: "Plus Size Bottomwear", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Bottom-Men-12-1716964394.jpg" },
  { name: "All Bottomwear", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-View-all--1--1707116393.jpg" },
]

const accessoriesCategories = [
  { name: "Mobile Covers", image: "https://images.bewakoof.com/uploads/grid/app/NewBottomNav-Jan-2024-420x420-Acessories-1-1717046093.jpg" },
  ...menTopwearCategories.slice(1)
]

export default function EcommerceLayout() {
  const [activeTab, setActiveTab] = useState("Men")
  const [activeSidebar, setActiveSidebar] = useState("Topwear")

  const sidebarCategories = activeTab === "Women" ? womenSidebarCategories : menSidebarCategories
  
  const getDisplayCategories = () => {
    if (activeTab === "Men") {
      return activeSidebar === "Bottomwear" ? menBottomwearCategories : menTopwearCategories
    } else if (activeTab === "Women") {
      return womenTopwearCategories
    } else if (activeTab === "Accessories") {
      return accessoriesCategories
    }
    return menTopwearCategories // Default case
  }

  const displayCategories = getDisplayCategories()

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-center space-x-8 py-4 border-b relative" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`font-semibold pb-4 w-1/3 ${
              activeTab === tab ? "text-cyan-400" : "text-gray-600"
            } hover:text-cyan-400 transition-colors relative`}
            onClick={() => {
              setActiveTab(tab)
              setActiveSidebar("Topwear") // Reset sidebar when changing tabs
            }}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" aria-hidden="true"></span>
            )}
          </button>
        ))}
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 bg-gray-100 overflow-y-auto">
          {sidebarCategories.map((category) => (
            <button
              key={category}
              className={`flex font-semibold py-4 w-full px-4 ${
                activeSidebar === category ? "bg-white" : "bg-gray-100"
              } hover:bg-gray-200 transition-colors relative text-left text-sm`}
              onClick={() => setActiveSidebar(category)}
            >
              {category}
            </button>
          ))}
        </aside>
        <main className="w-2/3 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {displayCategories.map((category) => (
              <div key={category.name} className="text-center">
                <div className="bg-gray-100 rounded-md mb-2 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-auto"
                  />
                </div>
                <p className="text-xs text-gray-600">{category.name}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}