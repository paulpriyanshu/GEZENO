'use client'

import React, { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
// import { Button } from "@/components/ui/button"
import { ChartConfig } from "@/components/ui/chart"
import { MainGraph } from '@/components/charts/MainGraph'
import { SalesGraph } from '@/components/charts/SalesGraph'
import AdminSideBar from '@/components/AdminSideBar'
import { Menu} from 'lucide-react'
import { BarChart } from 'lucide-react'
import { Settings } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toggleSidebar } from '../lib/store/features/adminsidebar/SideBarSlice'
export default function Dashboard() {
  const [isOpen,setIsOpen]=useState(false)
  const dispatch=useDispatch()

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]


  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } 
 

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button variant="outline" size="icon" className="md:hidden">
            </button>
            <button variant="outline">Yesterday</button>
          </div>
          <div>
            <button variant="outline">All channels</button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Online store sessions', value: '0', subValue: '↑ 100%' },
            { title: 'Total sales', value: '₹0.00', subValue: '—' },
            { title: 'Total orders', value: '0', subValue: '—' },
            { title: 'Conversion rate', value: '0%', subValue: '—' },
          ].map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.subValue}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graph Placeholder */}
        <Card className="hidden md:block mb-8">
          <CardContent className="p-6 w-full">
           
              <div className='flex justify-center p-3 w-full'>
              <MainGraph/>
              <SalesGraph/>

               
             </div>
              

          </CardContent>
        </Card>


       
      </main>

    
    </div>
  )
}