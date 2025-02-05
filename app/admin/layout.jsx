"use client";

import AdminHeader from "../../components/AdminHeader";
import AdminSideBar from "../../components/AdminSideBar";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../lib/store/features/adminsidebar/SideBarSlice";
import { useAppSelector } from "../lib/hooks";

export default function Layout({ children }) {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();
const sidebarRef = useRef(null);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 relative overflow-hidden">
        <div
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-200 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0`}
          style={{ top: 'var(--header-height, 0px)' }}
        >
          <div className="h-full overflow-y-auto">
            <AdminSideBar />
          </div>
        </div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 ">
          {children}
        </main>
      </div>
    </div>
  );
}