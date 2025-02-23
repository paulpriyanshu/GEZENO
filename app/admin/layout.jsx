"use client";

import AdminHeader from "../../components/AdminHeader";
import AdminSideBar from "../../components/AdminSideBar";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../lib/store/features/adminsidebar/SideBarSlice";
import { useAppSelector } from "../lib/hooks";

export default function Layout({ children }) {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ✅ Check for Admin Session Before Rendering
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/adminLogin"); // Redirect to login only if no token
    } 

    setLoading(false); // Stop loading once token check is done
  }, []);

  const handleClickOutside = (event) => {
    if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      dispatch(toggleSidebar());
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ✅ Show a loading screen while checking session
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-200 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0`}
          style={{ top: "var(--header-height, 0px)" }}
        >
          <div className="h-full overflow-y-auto">
            <AdminSideBar />
          </div>
        </div>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}