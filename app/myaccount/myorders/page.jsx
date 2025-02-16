"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Cookie from "js-cookie"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const email = Cookie.get('cred')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://backend.gezeno.in/api/orders/${email}`)
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()

        // ✅ Sort orders by createdAt (latest first)
        const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setOrders(sortedOrders)
        console.log(sortedOrders)
      } catch (err) {
        setError("Error fetching orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      
      {/* Scrollable Orders Section */}
      <div className="max-h-[700px] overflow-y-auto border border-gray-200 rounded-lg p-4 shadow-md">
        <div className="space-y-6">
          {orders.map((order, index) => (
            <Card key={order._id} className="border border-gray-300 shadow-sm">
              <CardHeader>
                {/* ✅ Correct numbering: Latest order should be #1 */}
                <CardTitle>Order #{orders.length - index}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderItems.map((item) => (
                        <TableRow key={item.product._id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="font-medium">
                            <img src={item.product.images[0].url} className="w-10 h-10" />
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {order.shippingInfo.street}, {order.shippingInfo.city}, {order.shippingInfo.pincode},{" "}
                            {order.shippingInfo.country}
                          </TableCell>
                          <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={order.orderStatus === "Processing" ? "secondary" : "success"}>
                              {order.orderStatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4">
                  <p><strong>Items Price:</strong> ${order.itemsPrice.toFixed(2)}</p>
                  <p><strong>Tax:</strong> ${order.taxPrice.toFixed(2)}</p>
                  <p><strong>Shipping:</strong> ${order.shippingPrice.toFixed(2)}</p>
                  <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
                  <p><strong>Payment Status:</strong> {order.paymentInfo.status}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}