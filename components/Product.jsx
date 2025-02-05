'use client'

import { useState, useEffect } from "react"
import { MapPin, Heart, LockIcon, RefreshCcwIcon, RefreshCcw, RotateCcw, PackageIcon, Star, FileText, ThumbsUp, ChevronLeft, ChevronRight, Plus, Share, ShoppingBag } from 'lucide-react'
import { cn } from "@/lib/utils"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge"
import NavBar from "@/components/NavBar"
import Loading from '../app/products/[id]/loading'
import { useRouter } from "next/navigation"
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { responsive, responsive_second, responsive_third } from "./ResponsiveFeatures"
import ZoomableImage from '@/components/ZoomableImage'
import {motion} from 'framer-motion'
import Reviews from "./Reviews"
import toast, { Toaster } from "react-hot-toast"
import MobileHomeFooter from "./MobileHomeFooter"

const dropdownVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export function CustomCarouselArrow({ onClick, direction, className }) {
  return (
    <Button
      variant="secondary"
      size="icon"
      className={`absolute z-10 top-1/2 -translate-y-1/2  bg-white/90 hover:bg-white shadow-md  rounded-full ${
        direction === 'left' ? 'left-4' : 'right-4'
      } ${className}`}
      onClick={onClick}
    >
      {direction === 'left' ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  )
}

export default function Product({id}) {
  const [selectedSize, setSelectedSize] = useState("")
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [pincode, setPincode] = useState("")
  const [isReturnsOpen, setIsReturnsOpen] = useState(false)
  const [navBarData, setNavBarData] = useState([])
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState([])
  const [notification,setNotification]=useState(null)
  const [isOffersOpen, setIsOffersOpen] = useState(false)
  const [mainImage, setMainImage] = useState("")
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({})
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productIds,setProductIds]=useState([])
  const router = useRouter()

  const sizes = ["XS", "S", "M", "L", "XL", "2XL"]
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleFilterChange = (filterName, tag) => {
    setSelectedFilters(prev => {
      const updatedFilters = { ...prev };
      if (!updatedFilters[filterName]) {
        updatedFilters[filterName] = [];
      }
      const index = updatedFilters[filterName].indexOf(tag);
      if (index > -1) {
        updatedFilters[filterName].splice(index, 1);
      } else {
        updatedFilters[filterName].push(tag);
      }
      return updatedFilters;
    });
  };
  const fetchCartData=async()=>{
    try {
      const cartData=await axios.get(`https://backend.gezeno.in/api/cart`)
      // console.log("this is cart data",cartData.data)
      setProductIds(cartData.data)
      return cartData.data
    } catch (error) {
      
    }
  }
  const handleAddToBag=async()=>{
   try {  

    // console.log("this is ",productIds)

    
    let items=[...productIds, product._id]
    setProductIds(items)

    console.log("this is items",items)
    console.log("this is prodcut id",product._id)
     localStorage.setItem('cart',JSON.stringify(items))
     showNotification("Added to Bag")
     toast.success("Added to Bag")
   } catch (error) {
    toast.error("Error adding product to bag",error)
    
   }

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeConfigResponse = await axios.get('https://backend.gezeno.in/api/home/headers')
        const productDetails = await axios.get(`https://backend.gezeno.in/api/products/${id}`)

        setProduct(productDetails?.data)
        const similarProducts = await axios.get(`https://backend.gezeno.in/api/productOfCategory/${productDetails?.data?.category}`)
        setRelatedProducts(similarProducts?.data?.products)
        
        console.log(similarProducts?.data?.products)
        console.log("this is product details,", productDetails)
        setMainImage(productDetails?.data?.images[0]?.url)
        setNavBarData(homeConfigResponse.data)
        const savedItems=localStorage.getItem('cart')
        if(savedItems){
          setProductIds(JSON.parse(savedItems))
        }
        // fetchCartData()
       
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
   
    fetchData()
  }, [id])
  

  if (loading) {
    return <Loading />
  }

  return (
    <div className="mx-auto">
      <div className="px-2">
      <Toaster position="top-right" />
      {/* {notification && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className="mb-4">
          <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )} */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-white border-b md:hidden">
          <button onClick={() => router.back()} className="p-2">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Share className="h-5 w-5" />
            </button>
            <button className="p-2">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <NavBar data={navBarData}/>
        </div>
        <div className="md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-8 mb-16 mt-10 px-5">
            {/* Left Column - Images */}
            <div className="sticky top-0 h-fit">
              {/* Mobile Carousel */}
              <div className="md:hidden w-full">
                <Carousel
                  swipeable={true}
                  draggable={true}
                  showDots={true}
                  responsive={responsive}
                  ssr={true}
                  infinite={true}
                  autoPlay={false}
                  autoPlaySpeed={1000}
                  keyBoardControl={true}
                  transitionDuration={10}
                  containerClass="carousel-container"
                  dotListClass="custom-dot-list-style flex justify-center mt-1"
                  arrows={true}
                >
                  {product.images?.map((slide, index) => (
                    <div
                      key={index}
                      className="relative w-full h-[500px] transition-opacity duration-1000 overflow-hidden"
                    >
                      <img
                        src={slide.url}
                        alt={`Slide ${index + 1}`}
                        className="w-11/12 h-full object-cover rounded-xl"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
              
              {/* Desktop Gallery */}
              <div className="hidden md:flex gap-2 p-4">
                <div className="flex flex-col gap-4">
                  {product.images?.map((image, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden w-20 h-20 cursor-pointer hover:border-primary"
                      onClick={() => setMainImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={`Product view ${index + 1}`}
                        width={90}
                        height={90}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <ZoomableImage
                    src={mainImage || (product.images && product.images[0]?.url)}
                    alt="Main product image"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">
                  {product.description?.split(" ").slice(0,50).join(" ")}...
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= 4.5 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm">4.5</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">₹{product.price}</span>
                <span className="text-muted-foreground line-through">₹2,649</span>
                <Badge variant="secondary" className="text-green-600">50% OFF</Badge>
              </div>

              <p className="text-sm text-muted-foreground">inclusive of all taxes</p>

              <div className="flex gap-2">
                <Badge variant="secondary">OVERSIZED FIT</Badge>
                <Badge variant="secondary">PREMIUM BLENDED FABRIC</Badge>
              </div>

              {/* Size Section */}
              {product.sizes && product?.sizes?.length > 0 && product.sizes[0]?.tags?.length>0 && (
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
                        className={cn(
                          "h-12 w-12",
                          selectedSize === size && "border-primary bg-primary/5"
                        )}
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
                    const distinctTags = [...new Set(filterGroup.tags)];
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
                                // Add color display for Color filter
                                filterGroup.filter.name === "Color" && "relative pl-10",
                              )}
                              onClick={() => handleFilterChange(filterGroup.filter.name, tag)}
                            >
                              {/* Add color circle for Color filter */}
                              {filterGroup.filter.name === "Color" && (
                                <span 
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border"
                                  style={{ 
                                    backgroundColor: tag.toLowerCase(),
                                    borderColor: tag.toLowerCase() === "white" ? "#e5e7eb" : tag.toLowerCase()
                                  }}
                                />
                              )}
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
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
                    {[...new Set(product.variants.map(v => v.variantName))].map((variantName) => {
                      const variant = product.variants.find(v => v.variantName === variantName);
                      return (
                        <Button
                        key={variant._id}
                        variant="outline"
                        className={cn(
                          "px-4 h-12 relative group",
                          selectedVariant === variant._id && "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedVariant(selectedVariant === variant._id ? null : variant._id)}
                      >
                        {/* Truncated Name */}
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                          {variantName?.length > 20 ? `${variantName.slice(0, 70)}...` : variantName}
                        </span>
                        
                        {/* Tooltip for Full Name */}
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:flex items-center">
                          <span className="bg-gray-400 text-white text-sm rounded px-2 py-1">
                            {variantName?.slice(0,100)}
                          </span>
                        </div>
                      </Button>
                      );
                    })}
                  </div>
                </div>
              )}


              <div className="flex gap-4">
                <Button className="flex-1 h-12" onClick={()=>handleAddToBag()}>
                <ShoppingBag className="w-5 h-5" />
                  ADD TO BAG
                </Button>
                {/* <Button variant="outline" className="h-12">
                  
                </Button> */}

                <Button className="flex-1 h-12 bg-white text-black hover:bg-slate-100" onClick={()=>handleAddToBag()}>
                <Heart className="w-5 h-5" /> 
                  WISHLIST
                </Button>
               
              </div>

              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium mb-2">Check for Delivery Details</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                      <Button variant="outline">CHECK</Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded text-sm text-blue-600">
                  <span className="w-5 h-5">🚚</span>
                  This product is eligible for FREE SHIPPING
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-semibold text-lg">Key Highlights</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground mb-1">Design</p>
                    <p>Embroidered</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Fit</p>
                    <p>Oversized Fit</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Neck</p>
                    <p>Round Neck</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Occasion</p>
                    <p>Winter wear</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Sleeve Style</p>
                    <p>Full Sleeve</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Wash Care</p>
                    <p>Machine wash as per tag</p>
                  </div>
                </div>
              </div>

              <div>
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
                          <Badge variant="outline" className="mt-1">Bank Offer</Badge>
                          <p>10% Instant Discount on HDFC Bank Credit Cards</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-1">Special Price</Badge>
                          <p>Get extra 5% off (price inclusive of discount)</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Product Description Section */}
                <div className="border-b p-5">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between py-4 px-0 hover:bg-transparent"
                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-6 h-6"/>
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
                          India
                        </div>
                        <div>
                          <span className="font-semibold">Manufactured By - </span>
                          Bewakoof Brands Pvt Ltd,<br />
                          Sairaj logistic hub #A5, BMC pipeline road, Opposite all saints high school,<br />
                          Amane, Bhiwandi, Thane, Maharashtra 421302
                        </div>
                        <div>
                          <span className="font-semibold">Packed By - </span>
                          Bewakoof Brands Pvt Ltd,<br />
                          Sairaj logistic hub #A5, BMC pipeline road, Opposite all saints high school,<br />
                          Amane, Bhiwandi, Thane, Maharashtra 421302
                        </div>
                        <div>
                          <span className="font-semibold">Commodity - </span>
                          Men&apos;s Sweatshirt
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-primary mb-2">Product Specifications</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Oversized fit - Super Loose On Body Thoda Hawa Aane De</li>
                            <li>60% Cotton, 40% Poly - Midweight fleece comprising 60% Cotton & 40% Poly - soft and sturdy for maximum comfort.</li>
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
              <div className="flex justify-between items-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xl">🔒</span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    100% SECURE<br />PAYMENT
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xl">📦</span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    EASY RETURNS &<br />INSTANT REFUNDS
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xl">✨</span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    100% GENUINE<br />PRODUCT
                  </p>
                </div>
              </div>

              <Reviews
                productRating={4.1}
                totalRatings={143}
                recommendationPercentage={83}
                ratingDistribution={[
                  { stars: 5, count: '81', percentage: 75, color: 'bg-green-500' },
                  { stars: 4, count: '38', percentage: 20, color: 'bg-green-500' },
                  { stars: 3, count: '17', percentage: 15, color: 'bg-yellow-500' },
                  { stars: 2, count: '2', percentage: 5, color: 'bg-orange-500' },
                  { stars: 1, count: '5', percentage: 2, color: 'bg-red-500' }
                ]}
                customerImages={[
                  { url: '/placeholder.svg', alt: 'Customer review 1' },
                  { url: '/placeholder.svg', alt: 'Customer review 2' },
                  { url: '/placeholder.svg', alt: 'Customer review 3' },
                  { url: '/placeholder.svg', alt: 'Customer review 4' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* You May Also Like section */}
        <div>
          <div className="mt-16 space-y-6 max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">You May Also Like</h2>
            <Carousel
              swipeable={true}
              draggable={true}
              responsive={responsive_third}
              ssr={true}
              infinite={true}
              autoPlay={true}
              keyBoardControl={true}
              transitionDuration={1000}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-50-px"
              customRightArrow={<CustomCarouselArrow direction="right" className="p-5"/>}
              customLeftArrow={<CustomCarouselArrow direction="left" className="p-5"/>}
            >
              {relatedProducts.map((product) => (
                <div key={product._id} className="group cursor-pointer relative m-2" onClick={() => router.push(`/products/${product._id}`)}>
                  <div className="relative aspect-[3/4] mb-3">
                    <Badge 
                      className="absolute top-2 left-2 z-10 bg-gray-800/80 text-white hover:bg-gray-800/80"
                    >
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
                      src={product?.images[0]?.url}
                      alt={product.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Gezeno</p>
                    <h3 className="text-sm text-muted-foreground line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{product.price}</span>
                      <span className="text-sm text-green-600">{product.discount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
   <div className='block md:hidden'>
     <MobileHomeFooter/>
     </div>
    </div>
  )
}

