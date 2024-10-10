"use client"

import React from "react"
import { Home, Package, Users, PieChart, Tag, ChevronRight, BookOpen, UserCircle, ChevronDown, Settings, Layout } from "lucide-react"
import { useAppSelector } from "@/app/lib/hooks"
import ProductsDropdown from "./ProductsDropDown"
import PagesDropdown from "./PagesDropdown"
import UserListDropdown from "./UserListDropdown"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminSideBar() {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen)
  const router = useRouter()

  const menuItems = [
    { icon: Home, label: "Home", route: "/" },
    { icon: Package, label: "Products", route: "products", isDropdown: true },
    { icon: Users, label: "Customers", route: "customers" },
    { icon: PieChart, label: "Analytics", route: "analytics" },
    { icon: Package, label: "Orders", route: "orders" },
    { icon: Tag, label: "Discounts", route: "discounts" },
    { icon: Tag, label: "Active Brands", route: "active-brands", isDropdown: true },
    { icon: Tag, label: "Inactive Brands", route: "inactive-brands", isDropdown: true },
    { icon: BookOpen, label: "Pages", route: "pages", isDropdown: true },
    { icon: UserCircle, label: "User List", route: "user-list", isDropdown: true },
    { icon: Layout, label: "Home Page Setup", route: "home-page-setup", isDropdown: true },
    { icon: Settings, label: "Settings", route: "settings" },
  ]

  const activeBrands = ["Nike", "Adidas", "Puma", "Under Armour", "Reebok"]
  const inactiveBrands = ["Fila", "Asics", "New Balance", "Converse", "Vans"]
  const homePageSetupOptions = [
    "HOT DEALS",
    "DYNAMIC SECTION",
    "MENS JEANS BANNER",
    "MEN' JEANS",
    "SHIRTS BANNER",
    "SHIRTS",
    "LEATHER BELT BANNER",
    "Leather Belt",
    "LEATHER WALLET BANNER",
    "LEATHER WALLET",
    "COTTON RUMAL BANNER",
    "COTTON RUMAL",
    "WATER BOTTLE BANNER",
    "WATER BOTTLE",
    "POPULAR TOWELS BANNER",
    "POPULAR TOWELS"
  ]

  const handleNavigation = (route) => {
    router.push(`/admin/${route}`)
  }

  return (
    <div className="bg-white h-screen w-64 overflow-y-auto transition-all duration-300">
      <div className="p-4 text-2xl font-bold border-b">Doxy Clothing</div>
      <nav className="space-y-2 p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="w-full">
            {item.isDropdown ? (
              item.label === "Products" ? (
                <ProductsDropdown />
              ) : item.label === "Pages" ? (
                <PagesDropdown />
              ) : item.label === "User List" ? (
                <UserListDropdown />
              ) : item.label === "Active Brands" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center">
                        <Tag className="w-5 h-5 mr-3" />
                        Active Brands
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <ScrollArea className="h-[200px]">
                      {activeBrands.map((brand, index) => (
                        <DropdownMenuItem key={index} onSelect={() => handleNavigation(`active-brands/${brand.toLowerCase()}`)}>
                          {brand}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.label === "Inactive Brands" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center">
                        <Tag className="w-5 h-5 mr-3" />
                        Inactive Brands
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <ScrollArea className="h-[200px]">
                      {inactiveBrands.map((brand, index) => (
                        <DropdownMenuItem key={index} onSelect={() => handleNavigation(`inactive-brands/${brand.toLowerCase()}`)}>
                          {brand}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.label === "Home Page Setup" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center">
                        <Layout className="w-5 h-5 mr-3" />
                        Home Page Setup
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <ScrollArea className="h-[300px]">
                      {homePageSetupOptions.map((option, index) => (
                        <DropdownMenuItem key={index} onSelect={() => handleNavigation(`home-page-setup/${option.toLowerCase().replace(/\s+/g, '-')}`)}>
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => handleNavigation(item.route)}
              >
                <span className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}