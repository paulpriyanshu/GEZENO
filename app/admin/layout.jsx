"use client";

import AdminHeader from "@/components/AdminHeader";
import AdminSideBar from "@/components/AdminSideBar";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../lib/store/features/adminsidebar/SideBarSlice";
import { useAppSelector } from "@/app/lib/hooks"; // To access Redux state

export default function Layout({ children }) {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen); // Get sidebar open state from Redux
  const dispatch = useDispatch();
  const sidebarRef = useRef(null); // Reference to the sidebar

  // Function to handle click outside
  const handleClickOutside = (event) => {
    // If sidebar is open and the clicked element is not inside the sidebar
    if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      dispatch(toggleSidebar()); // Close the sidebar
    }
  };

  // Add event listener for clicks outside the sidebar
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside); // Listen for mouse clicks
    } else {
      document.removeEventListener("mousedown", handleClickOutside); // Remove listener when sidebar is closed
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <AdminHeader />
      <div className="flex">
        {/* Sidebar - hidden by default on smaller screens */}
        <div
  ref={sidebarRef}
  className={`fixed lg:static transform lg:transform-none ${isOpen ? "translate-x-0" : "-translate-x-full"} 
  transition-transform duration-200 ease-in-out z-50 w-64 bg-white lg:block lg:w-1/6`}
>
          <AdminSideBar />
        </div>

        {/* Overlay for smaller screens when sidebar is open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={() => dispatch(toggleSidebar())} // Close sidebar when clicking on the overlay
          />
        )}

        {/* Main content area */}
        <div className="w-full lg:w-5/6">
          {children}
        </div>
      </div>
    </>
  );
}
