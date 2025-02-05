"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Save } from "lucide-react"



export default function DiscountsPage() {
  const [products, setProducts] = useState([
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 2999, discount: 10 },
    { id: 2, name: "Cotton Kurta", category: "Clothing", price: 1499, discount: 15 },
    { id: 3, name: "Smart Speaker", category: "Electronics", price: 3999, discount: 5 },
    { id: 4, name: "Yoga Mat", category: "Sports & Outdoors", price: 799, discount: 0 },
    { id: 5, name: "Stainless Steel Tiffin Box", category: "Home & Kitchen", price: 599, discount: 20 },
  ])

  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState("")

  const handleEdit = (id, currentDiscount) => {
    setEditingId(id)
    setEditValue(currentDiscount.toString())
  }

  const handleSave = (id) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, discount: parseFloat(editValue) || 0 } : product
    )
    setProducts(updatedProducts)
    setEditingId(null)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Discounts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Discounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount (%)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20"
                      />
                    ) : (
                      `${product.discount}%`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Button size="sm" onClick={() => handleSave(product.id)}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product.id, product.discount)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Discount Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Total Products</Label>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div>
              <Label>Products with Discount</Label>
              <p className="text-2xl font-bold">{products.filter(p => p.discount > 0).length}</p>
            </div>
            <div>
              <Label>Average Discount</Label>
              <p className="text-2xl font-bold">
                {(products.reduce((sum, p) => sum + p.discount, 0) / products.length).toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}