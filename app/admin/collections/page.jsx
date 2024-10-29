'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

const POLLING_INTERVAL = 10000 // 10 seconds
const REQUEST_TIMEOUT = 5000 // 5 seconds

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const pollingTimeoutRef = useRef(null)

  const fetchCollections = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

      const response = await axios.get('https://gezeno-website.onrender.com/api/getallcollections', {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.data.success && Array.isArray(response.data.data)) {
        setCollections(response.data.data)
        setError(null)
        setIsLoading(false)
        return true // Successful fetch
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        setError('Request timed out. Retrying...')
      } else {
        setError('Failed to fetch collections. Retrying...')
      }
      console.error('Error fetching collections:', err)
      return false // Failed fetch
    }
  }

  const startPolling = () => {
    pollingTimeoutRef.current = setTimeout(async () => {
      const success = await fetchCollections()
      if (!success) {
        startPolling() // Continue polling if fetch failed
      }
    }, POLLING_INTERVAL)
  }

  useEffect(() => {
    const initialFetch = async () => {
      const success = await fetchCollections()
      if (!success) {
        startPolling()
      }
    }

    initialFetch()

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current)
      }
    }
  }, [])

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
        {collections.map((collection) => (
          <Card key={collection._id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {collection.name}
                <Badge variant={collection.isActive ? "default" : "secondary"}>
                  {collection.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40 mb-4">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
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
                Created: {new Date(collection.createdAt).toLocaleDateString()}
              </p>
              {collection.description && (
                <p className="text-sm mt-2">{collection.description}</p>
              )}
              {collection.season && (
                <Badge variant="outline" className="mt-2 mr-2">{collection.season}</Badge>
              )}
              {collection.year && (
                <Badge variant="outline" className="mt-2">{collection.year}</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-bold p-4">Collections</h1>
      <ScrollArea className="flex-grow">
        <div className="container mx-auto p-4">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  )
}