'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ProductCategoryDisplay() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get('http://backend.gezeno.com/api/categories'),
        axios.get('http://backend.gezeno.com/api/getproducts')
      ])

      setCategories(categoriesRes.data.categories)
      setProducts(productsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Products and Categories</h1>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card key={product._id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>

                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover mb-4"
                    />
                  )}
                  <p className="font-bold mb-2">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mb-2">{product.shortDetails}</p>
                  <p className="text-sm text-gray-600 mb-2">Category: {product.category.name}</p>
                  <p className="text-sm text-gray-600 mb-2">Brand: {product.brand.name}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  <div className="mt-2">
                    {product.isNewArrival && (
                      <Badge variant="secondary" className="mr-2">New Arrival</Badge>
                    )}
                    {product.isTopSelling && (
                      <Badge variant="secondary" className="mr-2">Top Selling</Badge>
                    )}
                    {product.isBestSelling && (
                      <Badge variant="secondary">Best Selling</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category._id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}