"use client"

import React from 'react'
import { LogOut } from 'lucide-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
function HandleLogoutButton() {
    const router=useRouter()
    const handleLogout = () => {
        // Remove all the specified cookies
        Cookies.remove("authToken", { path: "/" })
        Cookies.remove("cred", { path: "/" })
        Cookies.remove("name", { path: "/" })
    
        // Optionally, clear any client-side states

    
        // Redirect the user to the login page
        router.push('/')
      }
  return (
    <button
    type="submit"
    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-gray-100 w-full text-left"
    onClick={handleLogout}
  >
    <LogOut />
    Logout
  </button>
  )
}

export default HandleLogoutButton