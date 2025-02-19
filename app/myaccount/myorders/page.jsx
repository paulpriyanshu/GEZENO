"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Cookie from "js-cookie"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const email = Cookie.get("cred")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://backend.gezeno.in/api/orders/${email}`)
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()

        const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setOrders(sortedOrders)
      } catch (err) {
        setError("Error fetching orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [email])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderOrderStatus = (status) => {
    const variants = {
      Processing: "secondary",
      Shipped: "primary",
      Delivered: "success",
      Cancelled: "destructive",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border border-gray-300 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <Card className="border border-red-300 shadow-sm bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <div className="max-h-[700px] overflow-y-auto border border-gray-200 rounded-lg p-4 shadow-md">
        <div className="space-y-6">
          {orders.map((order, index) => (
            <Card key={order._id} className="border border-gray-300 shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{orders.length - index}</span>
                  <span className="text-sm font-normal text-gray-500">{formatDate(order.createdAt)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderItems.map((item) => (
                        <TableRow key={item.product._id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <img
                              src={item?.product?.images[0]?.url || "/placeholder.svg"}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>{item.size || "N/A"}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    <p>
                      <span className="font-medium">Items Price:</span> ₹{order.itemsPrice.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Tax:</span> ₹{order.taxPrice.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Shipping:</span> ₹{order.shippingPrice.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> ₹{order.totalPrice.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span> {order.paymentInfo.status}
                    </p>
                    <p>
                      <span className="font-medium">Order Status:</span> {renderOrderStatus(order.orderStatus)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <p>{order.shippingInfo.street}</p>
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.pincode}
                    </p>
                    <p>{order.shippingInfo.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

