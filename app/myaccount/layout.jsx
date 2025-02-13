import React from "react";
import { headers } from "next/headers";
import Sidebar from "./sidebar";
import NavBar from "@/components/NavBar";

async function getNavBarData() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/home/headers", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch navbar data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return [];
  }
}

export default async function DashboardLayout({ children }) {
  const navBarData = await getNavBarData(); // Fetch navbar data

    const pathname = headers().get("next-url") || ""; // Get current URL path in server
  return (
  <>
    <div className="sticky top-0 z-50 bg-white shadow-md">
        <NavBar data={navBarData} />
      </div>
      <div className="flex flex-col min-h-screen bg-gray-50">
      
      <div className="flex flex-1 ">
        <div className="hidden md:block">
        <Sidebar  pathname={pathname} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
    </>
  );


}