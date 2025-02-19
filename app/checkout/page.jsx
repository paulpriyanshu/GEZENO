"use client"

import { useState, useEffect } from "react"
import { CreditCard, Wallet, Building2, Send, ChevronDown, ShoppingBag, Package, Shield } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"

export default function PaymentMethods() {
  const [cartProducts, setCartProducts] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("cod")
  const router = useRouter()
  const email = Cookie.get("cred")

  const handlePay = async () => {
    try {
      const user_data = await axios.post("https://backend.gezeno.in/api/get-user", { email })
      console.log("user data", user_data.data)
      if (user_data.status === 200 && user_data.data.address) {
        const orderItems = cartProducts.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          image: product.image,
          price: product.price,
          product: product._id,
          size: product.selectedSize,
        }))

        const itemsPrice = calculateTotal()
        const taxPrice = 0 // Assuming no tax for now
        const shippingPrice = selectedPayment === "cod" ? 20 : 0
        const totalPrice = itemsPrice + taxPrice + shippingPrice

        const order = await axios.post("https://backend.gezeno.in/api/createorder", {
          shippingInfo: user_data.data.address,
          orderItems,
          paymentInfo: {
            id: "payment_id", // You might want to generate this based on the payment method
            status: "pending",
            method: selectedPayment,
          },
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          userId: user_data.data._id,
        })

        console.log("Order created:", order.data)

        localStorage.setItem("cart", JSON.stringify([]))

        router.push("/myaccount/myorders")
      } else {
        router.push("/myaccount/myaddress")
      }
    } catch (error) {
      console.error("Error processing order:", error)
      router.push("/myaccount/myaddress")
    }
  }

  const fetchCartProducts = async () => {
    setCartLoading(true)
    try {
      const cartData = localStorage.getItem("cart")
      const cartItems = cartData ? JSON.parse(cartData) : []
      // console.log("cart",cartItems[0].productId)

      const productPromises = cartItems.map((item) =>
        axios
          .get(`https://backend.gezeno.in/api/products/${item.productId}`)
          .then((res) => ({
            ...res.data,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
          }))
          .catch((err) => {
            console.error(`Error fetching product ${item.productId}:`, err)
            return null
          }),
      )

      const products = await Promise.all(productPromises)
      const validProducts = products.filter((product) => product !== null)
      console.log("Fetched products:", validProducts)
      setCartProducts(validProducts)
    } catch (error) {
      console.error("Error fetching cart products:", error)
    } finally {
      setCartLoading(false)
    }
  }

  useEffect(() => {
    fetchCartProducts()
  }, [])

  const calculateTotal = () => {
    return cartProducts.reduce((total, product) => {
      const price = product.price
      return total + price * product.quantity
    }, 0)
  }

  const totalMRP = calculateTotal()
  const bagDiscount = 0
  const deliveryFee = selectedPayment === "cod" ? 20 : 0
  const subtotal = totalMRP - bagDiscount + deliveryFee

  return (
    <div className="container mx-auto p-6">
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left side - Payment Methods */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Choose Your Payment Method</h2>

          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-3">
            <div className="flex items-center space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
                <CreditCard className="h-5 w-5" />
                <span>Debit & Credit Card</span>
              </Label>
            </div>

            <div className="flex items-center space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer">
                <Wallet className="h-5 w-5" />
                <span>Wallet</span>
              </Label>
            </div>

            <div className="flex items-center space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer">
                <Send className="h-5 w-5" />
                <span>UPI</span>
              </Label>
            </div>

            <div className="flex items-center space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="netbanking" id="netbanking" />
              <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer">
                <Building2 className="h-5 w-5" />
                <span>Net banking</span>
              </Label>
            </div>

            <div className="flex items-center space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer">
                <Send className="h-5 w-5 rotate-45" />
                <div className="flex flex-col">
                  <span>Cash On Delivery</span>
                  <span className="text-sm text-muted-foreground">
                    Additional cash collection charges of ₹20 is applicable on this order.
                  </span>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-4">
            <Button className="w-full bg-cyan-200 hover:bg-cyan-300 text-black" onClick={handlePay}>
              PAY ₹{subtotal.toFixed(2)}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <span className="inline-block border-t px-4">OR</span>
            </div>
            <div className="text-center text-sm">Pay via UPI or Card and save handling charges</div>
            <div className="text-center font-medium">Pay now and save ₹20</div>
          </div>
        </div>

        {/* Right side - Order Summary */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Delivering order to Priyanshu</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-sm rounded">Home</span>
            </div>
          </div>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between border p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Item ({cartProducts.length})</span>
              </div>
              <ChevronDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-x border-b rounded-b-lg">
              {cartLoading ? (
                <p>Loading cart items...</p>
              ) : (
                cartProducts.map((product) => (
                  <div key={product._id} className="flex justify-between items-center py-2">
                    <div>
                      <p>{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {product.quantity}, Size: {product.selectedSize || "N/A"}
                      </p>
                    </div>
                    <p>₹{((product.discountedPrice || product.price) * product.quantity).toFixed(2)}</p>
                  </div>
                ))
              )}
            </CollapsibleContent>
          </Collapsible>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">PRICE SUMMARY</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total MRP (Incl. of taxes)</span>
                <span>₹{totalMRP.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Bag Discount</span>
                <span>-₹{bagDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="flex flex-col items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-center text-muted-foreground">100% SECURE PAYMENT</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Package className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-center text-muted-foreground">EASY RETURNS & INSTANT REFUNDS</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-center text-muted-foreground">100% GENUINE PRODUCT</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>We accept</p>
            <div className="flex justify-center gap-2 mt-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-14%20at%207.18.22%E2%80%AFPM-td9gojV2GsM4fRXZbjMSg57YfzcRvY.png"
                alt="Payment methods"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

