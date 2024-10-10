"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useAppDispatch } from '@/app/lib/hooks';
import { toggleSidebar } from '@/app/lib/store/features/adminsidebar/SideBarSlice';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function AdminHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter(); // Initialize useRouter

  const menuItems = [
    { label: 'Dashboard', route: '/admin/' },
    { label: 'Orders', route: '/admin/orders' },
    { label: 'Products', route: '/admin/products' },
    { label: 'Customers', route: '/admin/customers' },
    { label: 'Analytics', route: '/admin/analytics' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile menu */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2">
              <Menu className="h-6 w-6" onClick={() => dispatch(toggleSidebar())} />
            </Button>
            
            <a href="/" className="flex items-center">
              <img src="logo.webp" alt="Gezeno Logo" className='w-20 md:w-28' />
            </a>
          </div>

          {/* Navigation - hidden on mobile */}
          <nav className="hidden lg:flex space-x-4">
            {menuItems.map((item) => (
              <Link
              key={item.label}
              href={item.route}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              {item.label}
            </Link>
            ))}
          </nav>

          {/* Search, notifications, and profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-64 bg-gray-100 focus:bg-white transition-colors duration-200"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="User avatar"
                    className="h-8 w-8 rounded-full bg-slate-100"
                  />
                  <span className="hidden md:inline-block font-medium text-sm p-3">John Doe</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
