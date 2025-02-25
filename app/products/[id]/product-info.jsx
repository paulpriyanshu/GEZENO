"use client"

import { useEffect } from "react"

import { useState } from "react"
import { Heart, MapPin, Plus, ShoppingBag, Star, FileText, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import Reviews from "./reviews"
import { toast } from "react-hot-toast"
import Cookie from "js-cookie"
import axios from "axios"
const dropdownVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export default function ProductInfo({ product }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSize, setSelectedSize] = useState("")
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [pincode, setPincode] = useState("")
  const [isReturnsOpen, setIsReturnsOpen] = useState(false)
  const [isOffersOpen, setIsOffersOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [allFilters, setAllFilters] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const email = Cookie.get("cred")
  console.log("product", product)

  useEffect(() => {
    const filters = {}
    const addFilters = (item) => {
      item.filters?.forEach((filter) => {
        if (!filters[filter.filter.name]) {
          filters[filter.filter.name] = new Map() // Using Map to store product ID with each tag
        }
        filter.tags.forEach((tag) => {
          if (!filters[filter.filter.name].has(tag)) {
            filters[filter.filter.name].set(tag, item._id)
          }
        })
      })
    }

    // Add filters from current product
    addFilters(product)

    if (product.parentProduct) {
      // If parent product exists, add filters from parent and its variants
      addFilters(product.parentProduct)
      product.parentProduct.variants?.forEach(addFilters)
    } else {
      // If no parent product, add filters from variants of current product
      product.variants?.forEach(addFilters)
    }

    // Convert Map to array and format for rendering
    const formattedFilters = {}
    Object.entries(filters).forEach(([filterName, tagMap]) => {
      formattedFilters[filterName] = Array.from(tagMap).map(([tag, productId]) => ({
        tag,
        productId,
      }))
    })

    setAllFilters(formattedFilters)

    // Set initial selected filters based on URL params
    const initialFilters = {}
    searchParams.forEach((value, key) => {
      initialFilters[key] = value.split(",")
    })
    setSelectedFilters(initialFilters)

    // Set initial selected variant based on URL params
    const variantId = searchParams.get("variant")
    if (variantId) {
      setSelectedVariant(variantId)
    }
  }, [product, searchParams])

  const handleFilterChange = (filterName, tag, productId) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      if (!newFilters[filterName]) {
        newFilters[filterName] = []
      }
      const index = newFilters[filterName].indexOf(tag)
      if (index > -1) {
        newFilters[filterName].splice(index, 1)
      } else {
        newFilters[filterName].push(tag)
      }

      // Route to the appropriate product page
      if (productId) {
        // If it's a variant and there's no parent product, use /products/ path
        if (!product.parentProduct && product.variants?.some((v) => v._id === productId)) {
          router.push(`/products/${productId}`)
        } else {
          // If there's a parent product or it's not a variant, use /product/ path
          router.push(`/products/${productId}`)
        }
      }

      return newFilters
    })
  }

  const findMatchingItem = (filters) => {
    const matchesFilters = (item) => {
      return Object.entries(filters).every(([filterName, selectedTags]) => {
        return item.filters.some(
          (filter) => filter.filter.name === filterName && selectedTags.every((tag) => filter.tags.includes(tag)),
        )
      })
    }

    if (matchesFilters(product)) {
      return product
    }

    return product.variants.find(matchesFilters)
  }

  const handleVariantSelect = (variantId) => {
    setSelectedVariant(variantId)
    router.push(`/products/${variantId}`)
  }

  const handleAddToBag = async () => {
    try {
      // Check if sizes exist and no size is selected
      if (product.sizes?.length > 0 && !selectedSize) {
        toast.error("Please select a size before adding to bag")
        return
      }

      setIsLoading(true)

      const data = await axios.post("https://backend.gezeno.in/api/users/addToCart", {

          email, // Replace with actual user ID/email
          productId: product._id,
          quantity: 1,
          price: product.price,
          size: selectedSize, // Add the selected size to the request
      })

      if (!data) {
        throw new Error("Failed to add item to cart")
      }

      // const data = await response.json()
      toast.success("Added to bag successfully")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Error adding product to bag")
    } finally {
      setIsLoading(false)
    }
  }

  const isFilterSelected = (filterName, tag) => {
    // Check if it's in selected filters
    if (selectedFilters[filterName]?.includes(tag)) {
      return true
    }
    // Check if it matches current product's filters
    return product.filters?.some((filter) => filter.filter.name === filterName && filter.tags.includes(tag))
  }

  const isVariantSelected = (variantId) => {
    return selectedVariant === variantId
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
              className={cn(
                "w-4 h-4",
                star <= product.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground",
              )}
            />
          ))}
        </div>
        <span className="text-sm">{product.rating}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold">₹{product.price}</span>
        {product.discountedPrice && (
          <>
            <span className="text-muted-foreground line-through">₹{product.discountedPrice}</span>
            <Badge variant="secondary" className="text-green-600">
              {Math.round((1 - product.price / product.discountedPrice) * 100)}% OFF
            </Badge>
          </>
        )}
      </div>

      <p className="text-sm text-muted-foreground">inclusive of all taxes</p>

      {/* Filters Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Filters</h3>
        {Object.entries(allFilters).map(([filterName, tags]) => (
          <div key={filterName} className="mb-4">
            <h4 className="font-medium mb-2">{filterName}</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map(({ tag, productId }) => (
                <Button
                  key={`${filterName}-${tag}`}
                  variant="outline"
                  className={cn(
                    "px-4 h-10",
                    isFilterSelected(filterName, tag) && "border-primary bg-primary/5",
                    filterName.toLowerCase() === "color" && "relative pl-10",
                  )}
                  onClick={() => handleFilterChange(filterName, tag, productId)}
                >
                  {filterName.toLowerCase() === "color" && (
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
        ))}
      </div>

      {/* Size Section */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium">Select Size</span>
              {!selectedSize && <p className="text-sm text-red-500 mt-1">Please select a size to continue</p>}
            </div>
            <Button variant="link" className="text-blue-600">
              SIZE GUIDE
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes[0].tags.map((size) => (
              <Button
                key={size}
                variant="outline"
                className={cn(
                  "h-12 w-12",
                  selectedSize === size && "border-primary bg-primary/5",
                  !selectedSize && "border-red-200 hover:border-red-300",
                )}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
          {selectedSize && <p className="mt-2 text-sm text-muted-foreground">Selected size: {selectedSize}</p>}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          className={cn(
            "flex-1 h-12",
            product.sizes?.length > 0 && !selectedSize
              ? "bg-slate-600 hover:bg-gray-100 cursor-not-allowed opacity-50"
              : "",
            isLoading && "opacity-50 cursor-not-allowed",
          )}
          onClick={handleAddToBag}
          disabled={(product.sizes?.length > 0 && !selectedSize) || isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <ShoppingBag className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "ADDING..." : "ADD TO BAG"}
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
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-xl">Offers</div>
                <div className="text-muted-foreground text-lg">Save Extra With Offers</div>
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
        <div className="border-b p-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between py-4 px-0 hover:bg-transparent"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          >
            <div className="flex items-center gap-2">
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
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Country of Origin - </span>
                  {product.countryOfOrigin || "Not specified"}
                </div>
                <div>
                  <span className="font-semibold">Manufactured By - </span>
                  {product.manufacturer || "Not specified"}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-primary mb-2">Product Specifications</h4>
                  <p>{product.productSpecs || "No specifications available"}</p>
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
            <div className="flex items-center gap-2">
              <RotateCcw className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-xl">15 DAY RETURNS</div>
                <div className="text-muted-foreground text-lg">Return & exchange policy</div>
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
                <li>For any query/concern, please write to us at care@example.com</li>
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
            EASY RETURNS
            <br />
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
        productRating={product.rating}
        totalRatings={product.numOfReviews}
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

