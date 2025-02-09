'use client'

import { useState } from 'react'
import { Star, CheckCircle2,ThumbsUpIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import Image from 'next/image'



export default function Reviews({
  productRating,
  totalRatings,
  recommendationPercentage,
  ratingDistribution,
  customerImages
}) {
  const [activeTab, setActiveTab] = useState('product')

  const brandRatingDistribution = [
    { stars: 5, count: '5M+', percentage: 70, color: 'bg-green-500' },
    { stars: 4, count: '2M+', percentage: 20, color: 'bg-green-500' },
    { stars: 3, count: '535k+', percentage: 15, color: 'bg-yellow-500' },
    { stars: 2, count: '34k+', percentage: 10, color: 'bg-orange-500' },
    { stars: 1, count: '63k+', percentage: 5, color: 'bg-red-500' }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b mb-8 justify-center">
        <button
          className={cn(
            "px-6 py-4 text-lg font-semibold relative",
            activeTab === 'product' && "text-primary"
          )}
          onClick={() => setActiveTab('product')}
        >
          PRODUCT REVIEWS
          {activeTab === 'product' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400" />
          )}
        </button>
        {/* <button
          className={cn(
            "px-6 py-4 text-lg font-semibold relative",
            activeTab === 'brand' && "text-primary"
          )}
          onClick={() => setActiveTab('brand')}
        >
          BRAND REVIEWS
          {activeTab === 'brand' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400" />
          )}
        </button> */}
      </div>

      {/* Recommendation */}
      <div className="flex items-center gap-2 mb-8">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        <span className="text-lg">
          {recommendationPercentage}% of verified buyers recommend this product
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Rating Overview */}
        <div>
          <div className="bg-gray-50 rounded-full w-32 h-32 flex items-center justify-center mb-4">
            <span className="text-5xl font-medium text-green-500">{productRating}</span>
          </div>
          <div className="text-lg mb-2">{totalRatings} ratings</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-6 h-6",
                  star <= Math.floor(productRating) 
                    ? "fill-primary text-primary" 
                    : "text-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {(activeTab === 'product' ? ratingDistribution : brandRatingDistribution).map((rating) => (
            <div key={rating.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span>{rating.stars}</span>
                <Star className="w-4 h-4" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${rating.color}`} 
                  style={{ width: `${rating.percentage}%` }}
                />
              </div>
              <div className="w-16 text-right text-gray-600">({rating.count})</div>
            </div>
          ))}
        </div>
      </div>

      {activeTab === 'brand' && (
        <>
          {/* Customer Images */}
          <div className="mb-12">
            <h3 className="text-lg font-medium mb-6">Customer Images (19143)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Customer review image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg"
                      alt="Customer review thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">+8596</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Testimonials */}
          <div className="mb-12">
            <h3 className="text-lg font-medium mb-6">Hear what our customers say (10k+)</h3>
            <div className="flex gap-1 mb-4">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              From our Instagram #bewakoofofficial, @stealmyystyle, @shashanklala.official
            </p>
            <div className="flex gap-2 mb-8">
              {[1, 2].map((_, i) => (
                <div key={i} className="w-16 h-16 relative rounded overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="Instagram post"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                <span className="text-gray-600">+1</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Gezeno Fans</span>
              <div className="flex items-center gap-2">
                <span>4244 people found this helpful</span>
                <ThumbsUpIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

