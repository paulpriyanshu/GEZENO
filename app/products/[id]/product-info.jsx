"use client"

import { useState } from "react"
import { Heart, MapPin, Plus, ShoppingBag, Star, FileText, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import Reviews from "./reviews"
import { toast } from "react-hot-toast"

const dropdownVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export default function ProductInfo({ product }) {
  const [selectedSize, setSelectedSize] = useState("")
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [pincode, setPincode] = useState("")
  const [isReturnsOpen, setIsReturnsOpen] = useState(false)
  const [isOffersOpen, setIsOffersOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [productIds, setProductIds] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const handleFilterChange = (filterName, tag) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev }
      if (!updatedFilters[filterName]) {
        updatedFilters[filterName] = []
      }
      const index = updatedFilters[filterName].indexOf(tag)
      if (index > -1) {
        updatedFilters[filterName].splice(index, 1)
      } else {
        updatedFilters[filterName].push(tag)
      }
      return updatedFilters
    })
  }

  const handleAddToBag = () => {
    try {
      const items = [...productIds, product._id]
      setProductIds(items)
      localStorage.setItem("cart", JSON.stringify(items))
      toast.success("Added to Bag")
    } catch (error) {
      toast.error("Error adding product to bag")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        <p className="text-muted-foreground">{product.description?.split(" ").slice(0, 50).join(" ")}...</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn("w-4 h-4", star <= 4.5 ? "fill-primary text-primary" : "fill-muted text-muted-foreground")}
            />
          ))}
        </div>
        <span className="text-sm">4.5</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold">₹{product.price}</span>
        <span className="text-muted-foreground line-through">₹2,649</span>
        <Badge variant="secondary" className="text-green-600">
          50% OFF
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">inclusive of all taxes</p>

      <div className="flex gap-2">
        <Badge variant="secondary">OVERSIZED FIT</Badge>
        <Badge variant="secondary">PREMIUM BLENDED FABRIC</Badge>
      </div>

      {/* Size Section */}
      {product.sizes && product.sizes?.length > 0 && product.sizes[0]?.tags?.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Select Size</span>
            <Button variant="link" className="text-blue-600">
              SIZE GUIDE
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...new Set(product.sizes[0].tags)].map((size) => (
              <Button
                key={size}
                variant="outline"
                className={cn("h-12 w-12", selectedSize === size && "border-primary bg-primary/5")}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Section */}
      {product.filters && product.filters?.length > 0 && (
        <div>
          {product.filters.map((filterGroup) => {
            const distinctTags = [...new Set(filterGroup.tags)]
            return (
              <div key={filterGroup.filter._id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{filterGroup.filter.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {distinctTags.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      className={cn(
                        "px-4 h-12",
                        selectedFilters[filterGroup.filter.name]?.includes(tag) && "border-primary bg-primary/5",
                        filterGroup.filter.name === "Color" && "relative pl-10",
                      )}
                      onClick={() => handleFilterChange(filterGroup.filter.name, tag)}
                    >
                      {filterGroup.filter.name === "Color" && (
                        <span
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border"
                          style={{
                            backgroundColor: tag.toLowerCase(),
                            borderColor: tag.toLowerCase() === "white" ? "#e5e7eb" : tag.toLowerCase(),
                          }}
                        />
                      )}
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Variants Section */}
      {product.variants && product.variants?.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Select Variant</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...new Set(product.variants.map((v) => v.variantName))].map((variantName) => {
              const variant = product.variants.find((v) => v.variantName === variantName)
              return (
                <Button
                  key={variant._id}
                  variant="outline"
                  className={cn(
                    "px-4 h-12 relative group",
                    selectedVariant === variant._id && "border-primary bg-primary/5",
                  )}
                  onClick={() => setSelectedVariant(selectedVariant === variant._id ? null : variant._id)}
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {variantName?.length > 20 ? `${variantName.slice(0, 70)}...` : variantName}
                  </span>

                  <div className="absolute left-0 top-full mt-2 hidden group-hover:flex items-center">
                    <span className="bg-gray-400 text-white text-sm rounded px-2 py-1">
                      {variantName?.slice(0, 100)}
                    </span>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button className="flex-1 h-12" onClick={handleAddToBag}>
          <ShoppingBag className="w-5 h-5 mr-2" />
          ADD TO BAG
        </Button>
        <Button className="flex-1 h-12 bg-white text-black hover:bg-slate-100">
          <Heart className="w-5 h-5 mr-2" />
          WISHLIST
        </Button>
      </div>

      {/* Delivery Section */}
      <div className="space-y-4 border rounded-lg p-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 mt-1" />
          <div className="flex-1">
            <p className="font-medium mb-2">Check for Delivery Details</p>
            <div className="flex gap-2">
              <Input placeholder="Enter Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
              <Button variant="outline">CHECK</Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded text-sm text-blue-600">
          <span className="w-5 h-5">🚚</span>
          This product is eligible for FREE SHIPPING
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-6">
        {/* Offers Section */}
        <div className="border-b p-2">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between py-4 px-0 hover:bg-transparent"
            onClick={() => setIsOffersOpen(!isOffersOpen)}
          >
            <div className="flex items-center gap-4">
              <Star className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-xl">Offers</div>
                <div className="text-muted-foreground text-lg">Save Extra With 2 Offers</div>
              </div>
            </div>
            <Plus className={cn("h-5 w-5 transition-transform", isOffersOpen && "rotate-45")} />
          </Button>
          {isOffersOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              transition={{ duration: 0.5 }}
              className="py-4 space-y-4 text-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-1">
                    Bank Offer
                  </Badge>
                  <p>10% Instant Discount on HDFC Bank Credit Cards</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-1">
                    Special Price
                  </Badge>
                  <p>Get extra 5% off (price inclusive of discount)</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Description Section */}
        <div className="border-b p-5">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between py-4 px-0 hover:bg-transparent"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-xl">Product Description</div>
                <div className="text-muted-foreground text-lg">About this item</div>
              </div>
            </div>
            <Plus className={cn("h-5 w-5 transition-transform", isDescriptionOpen && "rotate-45")} />
          </Button>
          {isDescriptionOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              transition={{ duration: 0.5 }}
              className="py-4 space-y-6 text-lg"
            >
              {/* Description content */}
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Country of Origin - </span>
                  India
                </div>
                <div>
                  <span className="font-semibold">Manufactured By - </span>
                  Gezeno Brands Pvt Ltd
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary mb-2">Product Specifications</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Oversized fit - Super Loose On Body</li>
                    <li>60% Cotton, 40% Poly - Midweight fleece</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Returns Section */}
        <div className="border-b p-5">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between py-4 px-0 hover:bg-transparent"
            onClick={() => setIsReturnsOpen(!isReturnsOpen)}
          >
            <div className="flex items-center gap-4">
              <RotateCcw className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-xl">15 DAY RETURNS</div>
                <div className="text-muted-foreground text-lg">Know about return & exchange policy</div>
              </div>
            </div>
            <Plus className={cn("h-5 w-5 transition-transform", isReturnsOpen && "rotate-45")} />
          </Button>
          {isReturnsOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              transition={{ duration: 0.3 }}
              className="py-4 space-y-4 text-sm"
            >
              <p>Easy 15 days return and exchange. Return Policies may vary based on products and promotions.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>For any query/concern, please write to us at care@bewakoof.com</li>
                <li>Please refer to our return and exchange policy for more details</li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex justify-between items-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl">🔒</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            100% SECURE
            <br />
            PAYMENT
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl">📦</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            EASY RETURNS &<br />
            INSTANT REFUNDS
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl">✨</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            100% GENUINE
            <br />
            PRODUCT
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews
        productRating={4.1}
        totalRatings={143}
        recommendationPercentage={83}
        ratingDistribution={[
          { stars: 5, count: "81", percentage: 75, color: "bg-green-500" },
          { stars: 4, count: "38", percentage: 20, color: "bg-green-500" },
          { stars: 3, count: "17", percentage: 15, color: "bg-yellow-500" },
          { stars: 2, count: "2", percentage: 5, color: "bg-orange-500" },
          { stars: 1, count: "5", percentage: 2, color: "bg-red-500" },
        ]}
        customerImages={[
          { url: "/placeholder.svg", alt: "Customer review 1" },
          { url: "/placeholder.svg", alt: "Customer review 2" },
          { url: "/placeholder.svg", alt: "Customer review 3" },
          { url: "/placeholder.svg", alt: "Customer review 4" },
        ]}
      />
    </div>
  )
}

