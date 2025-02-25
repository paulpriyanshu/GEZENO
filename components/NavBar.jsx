"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { toggleSidebar } from "@/app/lib/store/features/homesidebar/HomeSideBarSlice"
import { useAppDispatch } from "@/app/lib/hooks"
import SearchBar from "./SearchBar"
import DropDownMenu from "./DropDownMenu"
import MobileSearch from "@/components/MobileSearch"
import UserLogo from "./UserLogo"
import Link from "next/link"
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function NavBar({ data }) {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log("inside header", data)
  })

  useEffect(() => {
    const token = Cookies.get("authToken")
    setIsLoggedIn(!!token)

    const name = Cookies.get("name")
    if (name) {
      setUsername(name)
    }
  }, [])

  const userEmail = Cookies.get('cred')
  const { data: cartData, error } = useSWR(userEmail ? `https://backend.gezeno.in/api/cart/${userEmail}` : null, fetcher, { refreshInterval: 1000 })

  const cartItemCount = cartData ? cartData.items.length : 0

  const handleCategoryHover = (categoryId) => {
    setHoveredCategory(categoryId)
  }

  const handleMouseLeave = () => {
    setHoveredCategory(null)
  }

  if (!data) {
    return <div className="flex justify-center items-center h-16">Loading...</div>
  }

  const { data: categories } = data

  const handleLogout = () => {
    Cookies.remove("authToken", { path: "/" })
    Cookies.remove("cred", { path: "/" })
    Cookies.remove("name", { path: "/" })

    setIsLoggedIn(false)
    setUsername("")

    router.push("/")
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-5">
            <button onClick={() => dispatch(toggleSidebar())} className="md:hidden">
              <img src="/hamburger.svg" alt="menu logo" width={24} height={24} />
            </button>
            <div onClick={() => router.push("/")} className="hover:cursor-pointer">
              <img src="/logo.webp" alt="Gezeno Logo" width={112} height={28} />
            </div>

            <nav className="hidden lg:flex items-center relative">
              {categories?.map((category) => (
                <div
                  key={category._id}
                  className="relative group"
                  onMouseEnter={() => handleCategoryHover(category.categoryId._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={`https://gezeno.in/category/${category.categoryId.name}/${category.categoryId._id}`}
                    className="text-gray-700 hover:text-gray-900 text-xs font-medium px-4 py-6 block"
                  >
                    {category.categoryId.name.toUpperCase()}
                    <span
                      className={`absolute left-0 right-0 bottom-0 h-0.5 bg-green-500 transition-transform duration-200 ${
                        hoveredCategory === category.categoryId._id ? "scale-x-100" : "scale-x-0"
                      } origin-left`}
                    ></span>
                  </a>
                </div>
              ))}

              {hoveredCategory && (
                <div
                  className="absolute left-1/2 transform -translate-x-[30%] top-full w-screen max-w-screen-lg bg-white shadow-lg"
                  style={{ marginTop: "1px" }}
                  onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                  onMouseLeave={handleMouseLeave}
                >
                  <DropDownMenu
                    category={categories.find((cat) => cat.categoryId._id === hoveredCategory)?.categoryId}
                  />
                </div>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <div className="w-[400px] bg-gray-100 rounded-md">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                {isLoggedIn ? (
                  <button className="hidden md:block">
                    <UserLogo className="text-gray-600 hover:text-gray-900" />
                  </button>
                ) : (
                  <button className="hidden md:block">
                    <div className="text-sm font-light" onClick={() => router.push("/signup")}>
                      Login
                    </div>
                  </button>
                )}
                {isLoggedIn && (
                  <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Hi, {username}
                      </a>
                      <Link href="/myaccount" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        My Account
                      </Link>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        My Wishlist
                      </a>
                      <Link
                        href={"/cart"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        My Orders
                      </Link>
                      <Link
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        role="menuitem"
                        href={"/admin/home"}
                      >
                        Admin
                      </Link>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <MobileSearch />

              <button className="text-gray-600 hover:text-gray-900">
                <img src="/heart.png" width={20} height={20} alt="Wishlist" />
              </button>

              <button className="text-gray-600 hover:text-gray-900 relative" onClick={() => router.push("/cart")}>
                <img src="/ic-web-head-cart.svg" width={24} height={24} alt="Cart" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md transform transition-transform duration-200 hover:scale-110">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
