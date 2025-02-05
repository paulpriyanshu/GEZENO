"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

export default function ProductGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0]?.url)

  return (
    <div className="sticky top-24">
      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          infinite={true}
          autoPlay={false}
          customLeftArrow={
            <Button variant="secondary" size="icon" className="absolute left-4 z-10 top-1/2 -translate-y-1/2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          }
          customRightArrow={
            <Button variant="secondary" size="icon" className="absolute right-4 z-10 top-1/2 -translate-y-1/2">
              <ChevronRight className="h-4 w-4" />
            </Button>
          }
        >
          {images?.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                priority={index === 0}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Desktop Gallery */}
      <div className="hidden md:flex gap-4">
        <div className="flex flex-col gap-4">
          {images?.map((image, index) => (
            <button
              key={index}
              className={cn(
                "border rounded-lg overflow-hidden w-20 h-20",
                mainImage === image.url && "ring-2 ring-primary",
              )}
              onClick={() => setMainImage(image.url)}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
        <div className="flex-1 relative aspect-square">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt="Main product image"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  )
}

