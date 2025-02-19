"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Menu, Search, ChevronDown, ChevronUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"
import { responsive_second } from "@/components/ResponsiveFeatures"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState({})
  const [shippingStatuses, setShippingStatuses] = useState({})
  const [orderData, setOrderData] = useState({
    order_id: "",
    order_date: "",
    pickup_location: "",
    channel_id: "",
    comment: "",
    billing_customer_name: "",
    billing_last_name: "",
    billing_address: "",
    billing_address_2: "",
    billing_city: "",
    billing_pincode: "",
    billing_state: "",
    billing_country: "",
    billing_email: "",
    billing_phone: "",
    shipping_is_billing: true,
    shipping_customer_name: "",
    shipping_last_name: "",
    shipping_address: "",
    shipping_address_2: "",
    shipping_city: "",
    shipping_pincode: "",
    shipping_country: "",
    shipping_state: "",
    shipping_email: "",
    shipping_phone: "",
    order_items: [
      {
        name: "",
        sku: "",
        units: 0,
        selling_price: "",
        discount: "",
        tax: "",
        hsn: "",
      },
    ],
    payment_method: "",
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: 0,
    length: 0,
    breadth: 0,
    height: 0,
    weight: 0,
  })

  const [adminToken, setAdminToken] = useState("") // Add state for admin token

  useEffect(() => {
    // Fetch admin token (replace with your actual token fetching logic)
    const fetchToken = async () => {
      try {
        // const response = await fetch("/api/admin/token") // Replace with your token endpoint
        // const data = await response.json()
        setAdminToken(localStorage.getItem('shippingToken'))
      } catch (error) {
        console.error("Error fetching admin token:", error)
      }
    }
    fetchToken()
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://backend.gezeno.in/api/orders")
      const data = await response.json()
      setOrders(data.orders)
      // Initialize shipping statuses
      const initialShippingStatuses = {}
      data.orders.forEach((order) => {
        initialShippingStatuses[order._id] = order.shippingStatus || "Not Shipped"
      })
      setShippingStatuses(initialShippingStatuses)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const handleShipOrder = async (order) => {
    console.log("Admin Token:", adminToken);
    
    try {
      console.log("Original Order:", order);
  
      // Format order data for Shiprocket API
      const formattedOrderData = {
        token: adminToken, // Include token in body instead of headers
        order_id: order._id,
        order_date: new Date(order.createdAt).toISOString(),
        pickup_location: "Primary",
        channel_id: "",
        comment: "Order from website",
        billing_customer_name: order.user.name || order.user.email.split("@")[0],
        billing_last_name: "",
        billing_address: order.shippingInfo.street,
        billing_address_2: "",
        billing_city: order.shippingInfo.city,
        billing_pincode: order.shippingInfo.pincode,
        billing_state: order.user.address.state || "",
        billing_country: order.shippingInfo.country,
        billing_email: order.user.email,
        billing_phone: order.user.phone || "",
        shipping_is_billing: true,
        shipping_customer_name: order.user.name || order.user.email.split("@")[0],
        shipping_last_name: "",
        shipping_address: order.shippingInfo.street,
        shipping_address_2: "",
        shipping_city: order.shippingInfo.city,
        shipping_pincode: order.shippingInfo.pincode,
        shipping_country: order.shippingInfo.country,
        shipping_state: order.shippingInfo.state || "",
        shipping_email: order.user.email,
        shipping_phone: order.shippingInfo.phone || "",
        order_items: order.orderItems.map((item, index) => ({
          name: item.name,
          sku: `${item.product._id}${(index + 1).toString()}`,
          units: item.quantity,
          selling_price: item.price.toString(),
          discount: ((item.price - (item.product.discountedPrice || item.price)) * item.quantity).toString(),
          tax: "0",
          hsn: "",
        })),
        payment_method: order.paymentInfo.status === "paid" ? "Prepaid" : "COD",
        shipping_charges: order.shippingPrice,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: order.orderItems.reduce(
          (sum, item) => sum + (item.price - (item.product.discountedPrice || item.price)) * item.quantity,
          0
        ),
        sub_total: order.itemsPrice,
        length: 10,
        breadth: 15,
        height: 20,
        weight: 2.5,
      };
  
      console.log("Formatted Order Data:", formattedOrderData);
  
      // Call your backend API instead of Shiprocket directly
      const response = await fetch("http://localhost:8080/api/shiprocket/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedOrderData),
      });
  
      const data = await response.json();
      console.log("Shipping Response:", data);
  
      if (data.status === 1) {
        setShippingStatuses((prev) => ({
          ...prev,
          [order._id]: "Shipped",
        }));
      } else {
        setShippingStatuses((prev) => ({
          ...prev,
          [order._id]: "Not Shipped",
        }));
      }
    } catch (error) {
      console.error("Error creating shipment:", error);
      setShippingStatuses((prev) => ({
        ...prev,
        [order._id]: "Not Shipped",
      }));
    } finally {
      setShippingStatuses((prev) => ({
        ...prev,
        [order._id]: "Shipped",
      }));
    }
  };

  const calculateOrderStats = () => {
    const totalOrders = orders.length
    const orderedItems = orders.reduce(
      (sum, order) => sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    )
    const fulfilledOrders = orders.filter((order) => order.orderStatus === "Delivered").length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalDiscount = orders.reduce((sum, order) => {
      return (
        sum +
        order.orderItems.reduce((itemSum, item) => {
          const originalPrice = item.price * item.quantity
          const discountedPrice = (item.product.discountedPrice || item.price) * item.quantity
          return itemSum + (originalPrice - discountedPrice)
        }, 0)
      )
    }, 0)

    return [
      { label: "Total orders", value: totalOrders.toString() },
      { label: "Ordered items", value: orderedItems.toString() },
      { label: "Total Revenue", value: `₹${totalRevenue.toFixed(2)}` },
      { label: "Total Savings", value: `₹${totalDiscount.toFixed(2)}` },
      { label: "Fulfilled orders", value: fulfilledOrders.toString() },
      { label: "Average Order Value", value: `₹${(totalRevenue / totalOrders).toFixed(2)}` },
    ]
  }

  const orderStats = calculateOrderStats()

  return (
    <div className="container mx-auto p-4 overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Header section remains the same */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-bold">Orders</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="hidden sm:inline-flex">
                Export
              </Button>
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

          {/* Enhanced Orders table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="w-[100px]">Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Customer name</TableHead>
                    <TableHead>Mobile No.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Size(s)</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Shipping Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <>
                      <TableRow
                        key={order._id}
                        className="cursor-pointer"
                        onClick={() => toggleOrderExpansion(order._id)}
                      >
                        <TableCell>
                          {expandedOrders[order._id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{order.user.email}</TableCell>
                        <TableCell>{order.user.fullName}</TableCell>
                        <TableCell>{order.user.phone}</TableCell>
                        <TableCell>₹{order.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          {order.orderItems
                            .map((item) => item.size)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.paymentInfo.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.paymentInfo.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          {shippingStatuses[order._id] === "Shipped" ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Shipped</span>
                          ) : shippingStatuses[order._id] === "Pending" ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShipOrder(order)
                              }}
                            >
                              Ship
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedOrders[order._id] && (
                        <TableRow>
                          <TableCell colSpan={10} className="bg-white">
                            <div className="p-4">
                              <h3 className="font-semibold mb-2">Order Details</h3>
                              <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                  <div key={item._id} className="flex items-start space-x-4 border-b pb-4">
                                    <div className="w-32 h-32 flex-shrink-0">
                                      <img
                                        src={item.product.images[0]?.url || "/api/placeholder/96/96"}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                                      <div className="text-sm text-gray-500">Size: {item.size || "N/A"}</div>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-lg font-semibold">
                                          ₹{(item.product.discountedPrice || item.price).toFixed(2)}
                                        </span>
                                        {item.product.discountedPrice && (
                                          <>
                                            <span className="text-sm text-gray-500 line-through">
                                              ₹{item.price.toFixed(2)}
                                            </span>
                                            <span className="text-sm text-green-600">
                                              {(
                                                ((item.price - item.product.discountedPrice) / item.price) *
                                                100
                                              ).toFixed(0)}
                                              % off
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between text-sm">
                                  <div>
                                    <p>Subtotal: ₹{order.itemsPrice.toFixed(2)}</p>
                                    <p>Shipping: ₹{order.shippingPrice.toFixed(2)}</p>
                                    <p>Tax: ₹{order.taxPrice.toFixed(2)}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-lg">Total: ₹{order.totalPrice.toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

