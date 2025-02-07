import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample order data
const orders = [
  {
    id: 1,
    productName: "Ergonomic Desk Chair",
    category: "Furniture",
    quantity: 2,
    address: "123 Main St",
    city: "Springfield",
    pincode: "62701",
    totalPrice: 299.98,
    couponsApplied: ["NEWCUSTOMER10"],
  },
  {
    id: 2,
    productName: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    quantity: 1,
    address: "456 Elm St",
    city: "Shelbyville",
    pincode: "62565",
    totalPrice: 249.99,
    couponsApplied: [],
  },
  {
    id: 3,
    productName: "Organic Cotton T-Shirt",
    category: "Clothing",
    quantity: 3,
    address: "789 Oak Ave",
    city: "Capital City",
    pincode: "62701",
    totalPrice: 59.97,
    couponsApplied: ["SUMMER20"],
  },
]

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Coupons Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{order.productName}</TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      {order.address}, {order.city}, {order.pincode}
                    </TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.couponsApplied.length > 0 ? (
                        order.couponsApplied.map((coupon, index) => (
                          <Badge key={index} variant="secondary" className="mr-1">
                            {coupon}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No coupons applied</span>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

