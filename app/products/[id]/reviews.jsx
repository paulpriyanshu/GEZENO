"use client"

import { Star } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// interface ReviewsProps {
//   productRating: number
//   totalRatings: number
//   recommendationPercentage: number
//   ratingDistribution: {
//     stars: number
//     count: string
//     percentage: number
//     color: string
//   }[]
//   customerImages: {
//     url: string
//     alt: string
//   }[]
// }

export default function Reviews({
  productRating,
  totalRatings,
  recommendationPercentage,
  ratingDistribution,
  customerImages,
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Ratings & Reviews</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Overall Rating */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{productRating}</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= Math.floor(productRating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted-foreground",
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Based on {totalRatings} ratings</p>
          <p className="text-sm">{recommendationPercentage}% of customers recommend this product</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count, percentage, color }) => (
            <div key={stars} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-12">
                <span>{stars}</span>
                <Star className="w-4 h-4 fill-current" />
              </div>
              <Progress value={percentage} className={cn("h-2", color)} />
              <span className="text-sm w-8">{count}</span>
            </div>
          ))}
        </div>

        {/* Customer Images */}
        <div>
          <h3 className="font-medium mb-4">Customer Photos</h3>
          <div className="grid grid-cols-4 gap-2">
            {customerImages.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

