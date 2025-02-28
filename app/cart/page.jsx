"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Heart, Truck, X, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Loading from "../category/[name]/[id]/loading"
import NavBar from "@/components/NavBar"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"
import { Input } from "@/components/ui/Input"
import useSWR, { mutate } from "swr"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Fetcher function for SWR
const fetcher = async (url) => {
  const response = await axios.get(url)
  return response.data
}

export default function CartPage() {
  const [NavBarData, setNavBarData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [newTotal, setNewTotal] = useState(null)
  const router = useRouter()
  const userEmail = Cookie.get("cred")

  // Fetch navbar data
  useSWR("https://backend.gezeno.in/api/home/headers", fetcher, {
    onSuccess: (data) => {
      setNavBarData(data)
      setLoading(false)
    },
    onError: () => setLoading(false),
  })

  // Fetch cart data using SWR
  const {
    data: cart,
    error: cartError,
    isLoading: cartLoading,
    mutate: mutateCart,
  } = useSWR(userEmail ? `https://backend.gezeno.in/api/users/cart/${userEmail}` : null, fetcher, {
    refreshInterval: 2000, // Refresh every 10 seconds
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  })
  console.log("original cart", cart)
  const cartProducts =
    cart?.items?.map((item) => ({
      ...item.product,
      quantity: item.quantity,
      selectedSize: item.size,
      price: item.price,
      total: item.total,
      categoryId: item.product.categoryId,
      discountAmount: item.discountAmount || 0,
      mrp: item.product.mrp,
    })) || []
  console.log("carProducts", cartProducts)

  const appliedDiscount = cart?.couponApplied?.discountAmount || 0

  const removeFromCart = async (productId, product) => {
    try {
      // Optimistic update
      console.log("product to be deleted", product)
      const optimisticData = {
        ...cart,
        items: cart.items.filter((item) => item.product._id !== productId),
      }
      mutate(`https://backend.gezeno.in/api/users/cart/${userEmail}`, optimisticData, false)

      // Make API call
      console.log("email", userEmail, "prosduct Id", productId, "selectedSize", product.selectedSize)
      await axios.post(`https://backend.gezeno.in/api/users/${userEmail}/${productId}`, {
        size: product.selectedSize, // Send size directly as JSON
      })

      // Revalidate the data
      mutateCart()
    } catch (error) {
      console.error("Error removing item from cart:", error)
      // Revalidate to show correct data
      mutateCart()
    }
  }

  const updateQuantity = async (productId, newQuantity, size) => {
    if (newQuantity < 1) return

    try {
      // Optimistic update remains the same
      const optimisticData = {
        ...cart,
        items: cart.items.map((item) =>
          item.product._id === productId ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item,
        ),
      }
      mutate(`https://backend.gezeno.in/api/users/cart/${userEmail}`, optimisticData, false)

      // Use new updateCart endpoint
      await axios.post(`https://backend.gezeno.in/api/users/updateCart`, {
        email: userEmail,
        productId,
        quantity: newQuantity,
        size: size,
      })

      // Revalidate the data
      mutateCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
      mutateCart()
    }
  }

  const increaseQuantity = (productId) => {
    const item = cart.items.find((item) => item.product._id === productId)
    if (item) updateQuantity(productId, item.quantity + 1, item.size)
  }

  const decreaseQuantity = (productId) => {
    const item = cart.items.find((item) => item.product._id === productId)
    if (item && item.quantity > 1) updateQuantity(productId, item.quantity - 1, item.size)
  }

  const validateCoupon = async () => {
    try {
      // Get category and product IDs from cart items
      console.log("Cart Prod", cartProducts)
      const categoryIds = cartProducts.map((product) => product.category).filter(Boolean)
      const productIds = cartProducts.map((product) => product._id)
      const orderValue = cartProducts.reduce((total, item) => total + item.price * item.quantity, 0)

      // Call coupon validation API
      console.log("category", categoryIds, "product", productIds, "coupon", couponCode, "ordderValue", orderValue)
      const response = await axios.post("https://backend.gezeno.in/api/apply", {
        email: userEmail,
        couponCode,
        orderValue,
        categoryIds,
        productIds,
      })
      console.log("coupon repsonse", response)

      if (response.data.success) {
        setCouponError("")
        setNewTotal(response.data.total)
        console.log("new total", response.data.updatedCart.total)
        setShowCouponInput(false)
        mutateCart()
      }
    } catch (error) {
      console.log("error", error)
      setCouponError(error.response?.data?.message || "Failed to apply coupon")
    }
  }

  // Add this function near the other cart-related functions
  const removeCoupon = async () => {
    try {
      await axios.post(`https://backend.gezeno.in/api/users/removeCoupon`, {
        email: userEmail,
        // cart: updatedCart,
      })

      setCouponCode("")
      mutateCart()
    } catch (error) {
      console.error("Error removing coupon:", error)
    }
  }

  // Update price summary section to show per-product discounts
  const renderProductSummary = (product) => (
    <div key={`summary-${product._id}`} className="text-sm border-b pb-2 last:border-0">
      <div className="flex justify-between">
        <span className="text-gray-600">{product.name}</span>
        <span>₹{Math.round(product.price * product.quantity)}</span>
      </div>
      {product.discountAmount > 0 && (
        <div className="flex justify-between text-green-600 text-xs">
          <span>Coupon Discount</span>
          <span>- ₹{Math.round(product.discountAmount)}</span>
        </div>
      )}
      {product.mrp && product.mrp > product.price && (
        <div className="flex justify-between text-green-600 text-xs">
          <span>Saved</span>
          <span>₹{Math.round((product.mrp - product.price) * product.quantity)}</span>
        </div>
      )}
    </div>
  )

  const onProceed = () => {
    if (!userEmail) {
      router.push("/login")
      return
    }
    router.push("/checkout")
  }
  useEffect(() => {
    console.log("cart", cartProducts)
  }, [cartProducts])
  if (isLoading) {
    return <Loading />
  }

  // Show error state
  if (cartError?.response?.status === 404 && cartError?.response?.data?.message === "Cart is empty") {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="hidden md:block">
          <NavBar data={NavBarData} />
        </div>
        <div className="container mx-auto mt-8">
          <div className="text-center p-8 border rounded-lg">
            <p className="text-gray-500">Your cart is empty</p>
            <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  } else if (cartError) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="hidden md:block">
          <NavBar data={NavBarData} />
        </div>
        <div className="container mx-auto mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load cart data. Please try again later.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden md:block">
        <NavBar data={NavBarData} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div onClick={() => router.back()} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-medium">Shopping Cart</h1>
            <p className="text-sm text-gray-500">{cartProducts.length} items</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block container mx-auto p-4">
        <h1 className="text-2xl font-medium mb-6">My Bag ({cartProducts.length} items)</h1>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            {cartLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading cart...</p>
              </div>
            ) : cartProducts.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-gray-500">Your cart is empty</p>
                <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cartProducts.map((product) => (
                <div key={product._id} className="border rounded-lg mb-4">
                  <div className="p-4 md:p-6">
                    <div className="flex gap-4 md:gap-6 relative">
                      <button
                        className="absolute right-0 top-0 md:hidden"
                        onClick={() => removeFromCart(product._id, product)}
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <img
                        src={product?.images[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-24 md:w-32 h-32 md:h-40 object-cover"
                      />
                      <div className="flex-1">
                        <h2 className="text-base md:text-lg font-medium pr-6 md:pr-0">{product.name}</h2>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mt-2 md:mt-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg md:text-xl font-bold">₹{product.price * product.quantity}</span>
                              {product.discountedPrice && (
                                <span className="text-sm line-through text-gray-500">
                                  ₹{product.discountedPrice * product.quantity}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {product.selectedFilters &&
                                Object.entries(product.selectedFilters).map(([filterName, filterValue]) => (
                                  <p key={filterName}>
                                    {filterName}: {Array.isArray(filterValue) ? filterValue.join(", ") : filterValue}
                                  </p>
                                ))}
                              {product.selectedSize && <p>Size: {product.selectedSize}</p>}
                            </div>
                          </div>
                          <div className="text-sm mt-2 md:mt-0">
                            <div className="flex items-center mt-2">
                              <Button onClick={() => decreaseQuantity(product._id)} variant="outline" size="sm">
                                -
                              </Button>
                              <span className="mx-2">{product.quantity}</span>
                              <Button onClick={() => increaseQuantity(product._id)} variant="outline" size="sm">
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-4 text-sm text-gray-600">
                          <Truck className="h-4 w-4" />
                          <span>Delivery by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                        <Button
                          variant="ghost"
                          className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto"
                          onClick={() => removeFromCart(product._id, product)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Price Summary */}
          <div className="space-y-4">
            {/* Offer Card */}
            <Card className="border-gray-200">
              <CardContent className="p-3 md:p-4">
                <p className="text-sm">
                  Whistles! Get extra 10% cashback on all prepaid orders above Rs.499. Use Code - PREP10.
                </p>
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <div className="bg-[#f0f7f7] rounded-lg">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#38b2ac] text-sm">Apply Coupon/Gift Card/Referral</span>
                  <Button
                    variant="link"
                    className="text-[#38b2ac] font-medium p-0"
                    onClick={() => setShowCouponInput(!showCouponInput)}
                  >
                    {showCouponInput ? "« Close" : "Redeem »"}
                  </Button>
                </div>
                {showCouponInput && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-white"
                      />
                      <Button onClick={validateCoupon}>Apply</Button>
                    </div>
                    {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                    {/* {appliedDiscount > 0 && (
                      <p className="text-green-600 text-sm">
                        Coupon applied successfully! You saved ₹{appliedDiscount}
                      </p>
                    )} */}
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary Card */}
            <Card>
              <CardHeader className="bg-gray-50 py-3">
                <CardTitle className="text-sm font-medium">PRICE SUMMARY</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {cartProducts.map((product) => renderProductSummary(product))}

                {appliedDiscount > 0 && cart.couponApplied && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Applied Coupon</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">{cart.couponApplied.code}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove coupon</span>
                      </Button>
                    </div>
                  </div>
                )}

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">- ₹{appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total MRP (Incl. of taxes)</span>
                    <span>
                      ₹{cartProducts.reduce((total, item) => total + (item.mrp || item.price) * item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bag Discount</span>
                    <span>
                      - ₹
                      {cartProducts.reduce(
                        (total, item) => total + ((item.mrp || item.price) - item.price) * item.quantity,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-2">
                    <span>Subtotal</span>
                    <span>
                      ₹{cartProducts.reduce((total, item) => total + item.price * item.quantity, 0) - appliedDiscount}
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="bg-[#e6f3f3] p-3 text-center text-sm">
                You are saving ₹
                {cartProducts.reduce(
                  (total, item) => total + ((item.mrp || item.price) - item.price) * item.quantity,
                  0,
                )}{" "}
                on this order
              </div>

              <div className="px-4 py-3 bg-blue-50 mt-4">
                <div className="flex items-center gap-2">
                  <img src="/icon-free-delivery.svg" alt="" className="w-8 h-8 md:w-10 md:h-10" />
                  <span className="text-sm font-medium">Yay! You get FREE delivery on this order</span>
                </div>
              </div>

              {/* Fixed Bottom Bar on Mobile */}
              <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t md:relative md:border-t md:mt-4 md:p-4">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                  <div>
                    <p className="text-sm">Total</p>
                    <p className="font-bold">
                      {/* ₹{newTotal ? newTotal : cartProducts.reduce((total, item) => total + item.price * item.quantity, 0)} */}
                      ₹{cart?.total}
                    </p>
                  </div>
                  <Button
                    className="bg-[#38b2ac] hover:bg-[#319795] text-white px-8 md:px-12 py-6"
                    disabled={cartProducts.length === 0}
                    onClick={onProceed}
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            </Card>

            {/* Trust Badges - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-3 gap-4 text-center">
              <div>
                <img src="/trust-cart.svg" alt="" className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs">100% SECURE PAYMENTS</p>
              </div>
              <div>
                <img src="/Easy-Returns.svg" alt="" className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs">EASY RETURNS & QUICK REFUNDS</p>
              </div>
              <div>
                <img src="/original-icon.webp" alt="" className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs">QUALITY ASSURANCE</p>
              </div>
            </div>

            {/* Payment Methods - Hidden on Mobile */}
            <div className="hidden md:block border rounded-lg p-4">
              <p className="text-sm font-medium mb-3">100% secure transaction</p>
              <img src="/Payment-trust-banner.svg" alt="Payment methods" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile */}
      <div className="h-20 md:h-0" />
    </div>
  )
}

