"use client"

import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CustomCarouselArrow } from "./carousel-arrow"

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
}

export default function RelatedProducts({ products }) {
  const router = useRouter()

  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-xl font-semibold mb-4">You May Also Like</h2>
      <Carousel
        swipeable={true}
        draggable={true}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customRightArrow={<CustomCarouselArrow direction="right" />}
        customLeftArrow={<CustomCarouselArrow direction="left" />}
        containerClass="carousel-container"
        itemClass="px-2"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="group cursor-pointer relative"
            onClick={() => router.push(`/products/${product._id}`)}
          >
            <div className="relative aspect-[3/4] mb-3">
              <Badge className="absolute top-2 left-2 z-10 bg-gray-800/80 text-white hover:bg-gray-800/80">
                {product.tag}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 hover:bg-white/20 hover:text-white"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <img
                src={product?.images[0]?.url || "/placeholder.svg"}
                alt={product.name}
                className="object-cover rounded-lg w-full h-full"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Gezeno</p>
              <h3 className="text-sm text-muted-foreground line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold">₹{product.price}</span>
                <span className="text-sm text-green-600">{product.discount}</span>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

