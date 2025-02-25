"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Component() {
  const [parentProduct, setParentProduct] = useState("")
  const [variantProduct, setVariantProduct] = useState("")
  const [products, setProducts] = useState([])
  const [notification, setNotification] = useState({ type: "", message: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://backend.gezeno.in/api/products/getProducts")
        setProducts(response.data)
      } catch (error) {
        console.error("Error fetching products:", error)
        setNotification({ type: "error", message: "Failed to fetch products. Please try again." })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!parentProduct || !variantProduct) {
      setNotification({ type: "error", message: "Please select both parent and variant products." })
      return
    }

    try {
      const response = await axios.post(`https://backend.gezeno.in/api/products/products/${parentProduct}/add-variant/${variantProduct}`)
      console.log("Variant added successfully:", response.data)
      setNotification({ type: "success", message: "Variant added successfully!" })
      // Reset form
      setParentProduct("")
      setVariantProduct("")
    } catch (error) {
      console.error("Error adding variant:", error)
      setNotification({ type: "error", message: "Failed to add variant. Please try again." })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading products...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4">
      {notification.message && (
        <Alert variant={notification.type === "error" ? "destructive" : "default"} className="mb-4">
          {notification.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <AlertTitle>{notification.type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add Product Variant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="parentProduct">Parent Product</Label>
            <Select onValueChange={setParentProduct} value={parentProduct} required>
              <SelectTrigger>
                <SelectValue placeholder="Select parent product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variantProduct">Variant Product</Label>
            <Select onValueChange={setVariantProduct} value={variantProduct} required>
              <SelectTrigger>
                <SelectValue placeholder="Select variant product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="mt-6">
        Add Variant
      </Button>
    </form>
  )
}

