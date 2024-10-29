'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://backend.gezeno.com/api/getallbrands')
        if (response.data.success && Array.isArray(response.data.data)) {
          setBrands(response.data.data)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        setError('Failed to fetch brands. Please try again later.')
        console.error('Error fetching brands:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const filteredBrands = brands.filter(brand => {
    if (filter === 'all') return true
    if (filter === 'active') return brand.isActive
    if (filter === 'inactive') return !brand.isActive
    return true
  })

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p>{error}</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <Card key={brand._id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {brand.name}
                <Badge variant={brand.isActive ? "default" : "secondary"}>
                  {brand.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40 mb-4">
                {brand.image ? (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=160&width=240"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Created: {new Date(brand.createdAt).toLocaleDateString()}
              </p>
              {brand.commingSoon && (
                <Badge variant="outline" className="mt-2">Coming Soon</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Brands</h1>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Brands
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Active Brands
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilter('inactive')}
          >
            Inactive Brands
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="container mx-auto p-4">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  )
}