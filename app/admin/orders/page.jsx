"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Package, Users, FileText, PieChart, Mail, Tag, Settings, Menu, Search, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AdminSideBar from '@/components/AdminSideBar'

const sidebarItems = [
  { icon: Home, label: 'Home' },
  { icon: Package, label: 'Orders' },
  { icon: Tag, label: 'Products' },
  { icon: Users, label: 'Customers' },
  { icon: FileText, label: 'Content' },
  { icon: PieChart, label: 'Analytics' },
  { icon: Mail, label: 'Marketing' },
  { icon: Tag, label: 'Discounts' },
]

const orderStats = [
  { label: 'Total orders', value: '0' },
  { label: 'Ordered items', value: '0' },
  { label: 'Returns', value: '0' },
  { label: 'Fulfilled orders', value: '0' },
  { label: 'Delivered orders', value: '0' },
  { label: 'Time to fulfill', value: '0 min' },
]

const orders = [
  { id: 'SL/1014/24-25', date: 'Jul 30 at 8:40 pm', customer: 'No customer', channel: 'Online Store', total: '₹0.00', paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled', items: '0 items', deliveryStatus: '', deliveryMethod: 'Shipping', tags: 'COD-Paid' },
  { id: 'SL/1013/24-25', date: 'Jul 30 at 7:56 pm', customer: 'PRIYANSHU PAUL', channel: 'Online Store', total: '₹0.00', paymentStatus: 'Voided', fulfillmentStatus: 'Unfulfilled', items: '0 items', deliveryStatus: '', deliveryMethod: 'Delivery Charges', tags: 'cancel-delivered' },
  { id: 'SL/1012/24-25', date: 'Jul 3 at 11:52 pm', customer: 'PRIYANSHU PAUL', channel: 'Online Store', total: '₹0.00', paymentStatus: 'Partially refunded', fulfillmentStatus: 'Unfulfilled', items: '0 items', deliveryStatus: '', deliveryMethod: 'Delivery Charges', tags: 'cancel-delivered' },
  { id: 'SL/1011/24-25', date: 'Jul 3 at 11:32 pm', customer: 'PRIYANSHU PAUL', channel: 'Online Store', total: '₹0.00', paymentStatus: 'Partially refunded', fulfillmentStatus: 'Unfulfilled', items: '0 items', deliveryStatus: '', deliveryMethod: 'Delivery Charges', tags: 'cancel-delivered' },
  { id: 'SL/1010/24-25', date: 'Jul 3 at 4:27 pm', customer: 'PRIYANSHU PAUL', channel: 'Online Store', total: '₹0.00', paymentStatus: 'Voided', fulfillmentStatus: 'Unfulfilled', items: '0 items', deliveryStatus: '', deliveryMethod: 'Delivery Charges', tags: '' },
]

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-bold">Orders</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="hidden sm:inline-flex">Export</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">More actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuItem>Import</DropdownMenuItem>
                  <DropdownMenuItem>Print packing slips</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>Create order</Button>
            </div>
          </div>

          {/* Order statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {orderStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">All</Button>
              <Button variant="outline">Unfulfilled</Button>
              <Button variant="outline">Unpaid</Button>
              <Button variant="outline">Open</Button>
              <Button variant="outline">Archived</Button>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input type="text" placeholder="Search orders" className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Orders table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Channel</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead className="hidden lg:table-cell">Items</TableHead>
                    <TableHead className="hidden xl:table-cell">Delivery</TableHead>
                    <TableHead className="hidden xl:table-cell">Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{order.date}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.channel}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${order.fulfillmentStatus === 'Fulfilled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.fulfillmentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{order.items}</TableCell>
                      <TableCell className="hidden xl:table-cell">{order.deliveryMethod}</TableCell>
                      <TableCell className="hidden xl:table-cell">{order.tags}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-4">
            Learn more about <a href="#" className="text-blue-500 hover:underline">orders</a>
          </p>
        </div>
      </main>

      {/* Settings */}
      {/* <div className="fixed bottom-4 left-4 z-10">
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </div> */}
    </div>
  )
}