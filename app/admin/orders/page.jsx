"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Menu, Search, ChevronDown, ChevronUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState({})
  const [shippingStatuses, setShippingStatuses] = useState({})
  const [adminToken, setAdminToken] = useState("") // Add state for admin token

  useEffect(() => {
    // Fetch admin token (replace with your actual token fetching logic)
    const fetchToken = async () => {
      try {
        // const response = await fetch("/api/admin/token") // Replace with your token endpoint
        // const data = await response.json()
        setAdminToken(localStorage.getItem("shippingToken"))
      } catch (error) {
        console.error("Error fetching admin token:", error)
      }
    }
    fetchToken()
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://backend.gezeno.in/api/orders/orders")
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
    console.log("Admin Token:", adminToken)

    try {
      console.log("Original Order:", order)

      // Format order data for Shiprocket API
      const formattedOrderData = {
        token: adminToken, // Include token in body instead of headers
        order_id: order._id,
        order_date: new Date(order.createdAt).toISOString(),
        pickup_location: "Primary",
        channel_id: "",
        comment: "Order from website",
        billing_customer_name: order.user?.name || order.user?.email?.split("@")[0] || "",
        billing_last_name: "",
        billing_address: order.shippingInfo?.street || "",
        billing_address_2: "",
        billing_city: order.shippingInfo?.city || "",
        billing_pincode: order.shippingInfo?.pincode || "",
        billing_state: order.user?.address?.state || "",
        billing_country: order.shippingInfo?.country || "India",
        billing_email: order.user?.email || "",
        billing_phone: order.user?.phone || "",
        shipping_is_billing: true,
        shipping_customer_name: order.user?.name || order.user?.email?.split("@")[0] || "",
        shipping_last_name: "",
        shipping_address: order.shippingInfo?.street || "",
        shipping_address_2: "",
        shipping_city: order.shippingInfo?.city || "",
        shipping_pincode: order.shippingInfo?.pincode || "",
        shipping_country: order.shippingInfo?.country || "India",
        shipping_state: order.shippingInfo?.state || "",
        shipping_email: order.user?.email || "",
        shipping_phone: order.shippingInfo?.phone || "",
        order_items: order.orderItems.map((item, index) => ({
          name: item.name,
          sku: `${item.product?._id || ""}${(index + 1).toString()}`,
          units: item.quantity,
          selling_price: item.discountedPrice?.toString() || "0",
          discount: ((item.originalPrice - item.discountedPrice) * item.quantity).toString(),
          tax: "0",
          hsn: "",
        })),
        payment_method: order.paymentInfo?.status === "paid" ? "Prepaid" : "COD",
        shipping_charges: order.shippingPrice || 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: order.orderItems.reduce(
          (sum, item) => sum + (item.originalPrice - item.discountedPrice) * item.quantity,
          0,
        ),
        sub_total: order.itemsPrice || 0,
        length: 10,
        breadth: 15,
        height: 20,
        weight: 2.5,
      }

      console.log("Formatted Order Data:", formattedOrderData)

      // Call your backend API instead of Shiprocket directly
      const data = await axios.post("https://backend.gezeno.in/api/orders/shiprocket/create-order",formattedOrderData);

      console.log("Shipping Response:", data)

      if (data.data.status_code === 1) {
        setShippingStatuses((prev) => ({
          ...prev,
          [order._id]: "Shipped",
        }))
      } else {
        setShippingStatuses((prev) => ({
          ...prev,
          [order._id]: "Not Shipped",
        }))
      }
    } catch (error) {
      console.error("Error creating shipment:", error)
      setShippingStatuses((prev) => ({
        ...prev,
        [order._id]: "Not Shipped",
      }))
    } finally {
      setShippingStatuses((prev) => ({
        ...prev,
        [order._id]: "Shipped",
      }))
    }
  }

  const calculateOrderStats = () => {
    const totalOrders = orders.length
    const orderedItems = orders.reduce(
      (sum, order) => sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    )
    const fulfilledOrders = orders.filter((order) => order.orderStatus === "Delivered").length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalDiscount = orders.reduce((sum, order) => {
      // Calculate discounts from coupons
      const couponDiscount =
        order.couponsApplied?.reduce((couponSum, coupon) => couponSum + coupon.discountAmount, 0) || 0

      // Calculate product discounts
      const productDiscount = order.orderItems.reduce((itemSum, item) => {
        return itemSum + (item.originalPrice - item.discountedPrice) * item.quantity
      }, 0)

      return sum + couponDiscount + productDiscount
    }, 0)

    return [
      { label: "Total orders", value: totalOrders.toString() },
      { label: "Ordered items", value: orderedItems.toString() },
      { label: "Total Revenue", value: `₹${totalRevenue.toFixed(2)}` },
      { label: "Total Savings", value: `₹${totalDiscount.toFixed(2)}` },
      { label: "Fulfilled orders", value: fulfilledOrders.toString() },
      { label: "Average Order Value", value: `₹${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}` },
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
                    <TableHead>Address</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
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
                        <TableCell>{order.user?.email || "N/A"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{order.shippingInfo?.street || "N/A"}</TableCell>
                        <TableCell>₹{order.totalPrice?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>{order.orderItems?.length || 0}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.paymentInfo?.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.paymentInfo?.status || "pending"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.orderStatus === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.orderStatus || "Processing"}
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                  <h3 className="font-semibold mb-2">Customer Information</h3>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <span className="font-medium">Email:</span> {order.user?.email || "N/A"}
                                    </p>
                                    <p>
                                      <span className="font-medium">Name:</span> {order.user?.fullName || "N/A"}
                                    </p>
                                    <p>
                                      <span className="font-medium">Phone:</span> {order.user?.phone || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                                  <div className="space-y-1 text-sm">
                                    <p>{order.shippingInfo?.street || "N/A"}</p>
                                    <p>
                                      {order.shippingInfo?.city || "N/A"}, {order.shippingInfo?.pincode || "N/A"}
                                    </p>
                                    <p>{order.shippingInfo?.country || "N/A"}</p>
                                  </div>
                                </div>
                              </div>

                              <h3 className="font-semibold mb-2">Order Items</h3>
                              <div className="space-y-4">
                                {order.orderItems?.map((item) => (
                                  <div key={item._id} className="flex items-start space-x-4 border-b pb-4">
                                    <div className="w-32 h-32 flex-shrink-0">
                                      <img
                                        src={item.product?.images?.[0]?.url || "/placeholder.svg?height=128&width=128"}
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
                                          ₹{item.discountedPrice?.toFixed(2) || "0.00"}
                                        </span>
                                        {item.originalPrice !== item.discountedPrice && (
                                          <>
                                            <span className="text-sm text-gray-500 line-through">
                                              ₹{item.originalPrice?.toFixed(2) || "0.00"}
                                            </span>
                                            <span className="text-sm text-green-600">
                                              {item.originalPrice > 0
                                                ? (
                                                    ((item.originalPrice - item.discountedPrice) / item.originalPrice) *
                                                    100
                                                  ).toFixed(0)
                                                : 0}
                                              % off
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Order Summary</h3>
                                  <div className="space-y-1 border-b pb-2 mb-2">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>
                                        ₹
                                        {order.orderItems
                                          ?.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
                                          .toFixed(2) || "0.00"}
                                      </span>
                                    </div>

                                    {order.couponsApplied && order.couponsApplied.length > 0 && (
                                      <>
                                        <div className="flex flex-col">
                                          <span className="font-medium text-sm">Discounts:</span>
                                          {order.couponsApplied.map((coupon) => (
                                            <div key={coupon._id} className="flex justify-between pl-4 text-green-600">
                                              <span>
                                                <Badge variant="outline" className="mr-1">
                                                  {coupon.code}
                                                </Badge>
                                              </span>
                                              <span>-₹{coupon.discountAmount.toFixed(2)}</span>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex justify-between font-medium">
                                          <span>Discounted Subtotal:</span>
                                          <span>₹{order.itemsPrice?.toFixed(2) || "0.00"}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Tax:</span>
                                      <span>₹{order.taxPrice?.toFixed(2) || "0.00"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Shipping:</span>
                                      <span>₹{order.shippingPrice?.toFixed(2) || "0.00"}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-1 border-t mt-1">
                                      <span>Total:</span>
                                      <span>₹{order.totalPrice?.toFixed(2) || "0.00"}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Payment & Shipping</h3>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Payment ID:</span>
                                      <span>{order.paymentInfo?.id || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Payment Status:</span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          order.paymentInfo?.status === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {order.paymentInfo?.status || "pending"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Order Status:</span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          order.orderStatus === "Delivered"
                                            ? "bg-green-100 text-green-800"
                                            : order.orderStatus === "Processing"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {order.orderStatus || "Processing"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Shipping Status:</span>
                                      {shippingStatuses[order._id] === "Shipped" ? (
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                          Shipped
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                          Not Shipped
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-4">
                                      {shippingStatuses[order._id] !== "Shipped" && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleShipOrder(order)
                                          }}
                                        >
                                          Ship Order
                                        </Button>
                                      )}
                                    </div>
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

