"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Heart, Truck, X, Trash2 } from "lucide-react"
import Link from "next/link"
import Loading from "../category/[name]/[id]/loading"
import NavBar from "@/components/NavBar"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"

export default function CartPage() {
  const [NavBarData, setNavBarData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [cartProducts, setCartProducts] = useState([])
  const [cartLoading, setCartLoading] = useState(true)
  const router = useRouter()
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeresponse = await axios.get("https://backend.gezeno.in/api/home/headers")
        setNavBarData(homeresponse.data)
        //  console.log(homeresponse.data)
      } catch (error) {
        console.log("error", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const removeFromCart = (productId) => {
    setCartLoading(true)
    const cartData = localStorage.getItem("cart")
    const cartItemIds = cartData ? JSON.parse(cartData) : []
    const updatedCartItemIds = cartItemIds.filter((id) => id !== productId)
    localStorage.setItem("cart", JSON.stringify(updatedCartItemIds))
    setCartProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId))
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
    setCartLoading(false)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    const cartData = localStorage.getItem("cart")
    const cartItemIds = cartData ? JSON.parse(cartData) : []
    const currentQuantity = cartItemIds.filter((id) => id === productId).length

    if (newQuantity > currentQuantity) {
      // Add more instances of the product ID
      const toAdd = newQuantity - currentQuantity
      const updatedCartItemIds = [...cartItemIds, ...Array(toAdd).fill(productId)]
      localStorage.setItem("cart", JSON.stringify(updatedCartItemIds))
    } else if (newQuantity < currentQuantity) {
      // Remove some instances of the product ID
      let toRemove = currentQuantity - newQuantity
      const updatedCartItemIds = cartItemIds.filter((id, index) => {
        if (id === productId) {
          if (toRemove > 0) {
            toRemove--
            return false
          }
        }
        return true
      })
      localStorage.setItem("cart", JSON.stringify(updatedCartItemIds))
    }

    setCartProducts((prevProducts) =>
      prevProducts.map((product) => (product._id === productId ? { ...product, quantity: newQuantity } : product)),
    )
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const increaseQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId)
    if (item) updateQuantity(productId, item.quantity + 1)
  }

  const decreaseQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId)
    if (item && item.quantity > 1) updateQuantity(productId, item.quantity - 1)
  }

  const fetchCartProducts = async () => {
    setCartLoading(true)
    try {
      const cartData = localStorage.getItem("cart")
      const cartItemIds = cartData ? JSON.parse(cartData) : []

      // Count occurrences of each product ID
      const itemCounts = cartItemIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1
        return acc
      }, {})

      const uniqueIds = [...new Set(cartItemIds)]

      const productPromises = uniqueIds.map((id) =>
        axios
          .get(`https://backend.gezeno.in/api/products/${id}`)
          .then((res) => ({ ...res.data, quantity: itemCounts[id] }))
          .catch((err) => {
            console.error(`Error fetching product ${id}:`, err)
            return null
          }),
      )

      const products = await Promise.all(productPromises)
      const validProducts = products.filter((product) => product !== null)
      setCartProducts(validProducts)
      setCartItems(validProducts.map((product) => ({ id: product._id, quantity: product.quantity })))
    } catch (error) {
      console.error("Error fetching cart products:", error)
    } finally {
      setCartLoading(false)
    }
  }

  useEffect(() => {
    fetchCartProducts()
  }, [])
  const onProceed = () => {
    const user_email = Cookie.get('cred')

    if (!user_email) {
      router.push('/login')  // Redirect to login if no email is found
      return
    }

    router.push('/checkout') // Redirect to checkout if logged in
  }


  useEffect(() => {
    if (cartItems.length > 0 && cartProducts.length === 0) {
      fetchCartProducts()
    }
  }, [cartItems])

  if (isLoading) {
    return <Loading />
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
                <p>Updating cart...</p>
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
                      <button className="absolute right-0 top-0 md:hidden"  onClick={() => removeFromCart(product._id)}> 
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
                              {product.price && (
                                <span className="text-sm line-through text-gray-500">
                                  ₹{product.discountedPrice * product.quantity}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {/* {product.price && (
                                <div className="flex justify-between text-green-600">
                                  <span>Discount:</span>
                                  <span>-₹{(product.discountedPrice) * product.quantity}</span>
                                </div>
                              )} */}
                            
                            </div>
                          </div>
                          <div className="text-sm mt-2 md:mt-0">
                            <p>Size: {product.size || "Standard"}</p>
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
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto"
                          onClick={() => removeFromCart(product._id)}
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
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-[#38b2ac] text-sm">Apply Coupon/Gift Card/Referral</span>
                <Button variant="link" className="text-[#38b2ac] font-medium p-0">
                  Redeem »
                </Button>
              </div>
            </div>

            {/* Price Summary Card */}
            <Card>
              <CardHeader className="bg-gray-50 py-3">
                <CardTitle className="text-sm font-medium">PRICE SUMMARY</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Individual Product Prices */}
                {cartProducts.map((product) => (
                  <div key={`summary-${product.id}`} className="text-sm border-b pb-2 last:border-0">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{product.name}</span>
                      <span>₹{product.price * product.quantity}</span>
                    </div>
                    {product.mrp && product.mrp > product.price && (
                      <div className="flex justify-between text-green-600 text-xs">
                        <span>Saved</span>
                        <span>₹{(product.mrp - product.price) * product.quantity}</span>
                      </div>
                    )}
                  </div>
                ))}
                {/* Summary Totals */}
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
                    <span>₹{cartProducts.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
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
                      ₹{cartProducts.reduce((total, item) => total + item.price * item.quantity, 0)}
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

      {/* Add bottom padding to account for fixed proceed button on mobile */}
      <div className="h-20 md:h-0" />
    </div>
  )
}

