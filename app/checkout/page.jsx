"use client"

import { useState } from "react"
import { CreditCard, Wallet, Building2, Send, ChevronDown, ShoppingBag, Package, Shield } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"
import useSWR from "swr"

const fetcher = (url) => axios.get(url).then((res) => res.data)

export default function PaymentMethods() {
  const [selectedPayment, setSelectedPayment] = useState("cod")
  const router = useRouter()
  const userEmail = Cookie.get("cred")

  const { data: cart, error: cartError } = useSWR(
    userEmail ? `https://backend.gezeno.in/api/users/cart/${userEmail}` : null,
    fetcher,
  )

  const cartProducts =
    cart?.items?.map((item) => ({
      ...item.product,
      quantity: item.quantity,
      selectedSize: item.size,
      price: item.price,
      total: item.total,
      discountAmount: item.discountAmount || 0,
    })) || []

  const handlePay = async () => {
    try {
      const user_data = await axios.post("https://backend.gezeno.in/api/users/get-user", { email: userEmail })
      console.log("user data", user_data.data)
      if (user_data.status === 200 && user_data.data.address) {
        const orderItems = cartProducts.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          product: product._id,
          size: product.selectedSize || null,
        }))

        const subtotal = cart.total
        const taxPrice = subtotal * 0.18 // 18% GST
        const shippingPrice = selectedPayment === "cod" ? 20 : 0
        const totalPrice = cart.total + taxPrice + shippingPrice
        const orderData = {
          shippingInfo: user_data.data.address,
          orderItems,
          paymentInfo: {
            id: "payment_id",
            status: "pending",
            method: selectedPayment,
          },
          itemsPrice: subtotal,
          taxPrice,
          shippingPrice,
          totalPrice,
          couponsApplied: cart.couponApplied ? [cart.couponApplied] : [], // Convert to array format
          userId: user_data.data._id,
        };
        
        // Print the order data before sending the request
        console.log("Order Data:", orderData);
        
        const order = await axios.post("https://backend.gezeno.in/api/orders/createOrder", orderData);
        // const order = await axios.post("https://backend.gezeno.in/api/createOrder", {
        //   shippingInfo: user_data.data.address,
        //   orderItems,
        //   paymentInfo: {
        //     id: "payment_id",
        //     status: "pending",
        //     method: selectedPayment,
        //   },
        //   itemsPrice: subtotal,
        //   taxPrice,
        //   shippingPrice,
        //   totalPrice,
        //   couponsApplied: cart.couponApplied ? [cart.couponApplied] : [], // Convert to array format
        //   userId: user_data.data._id,
        // })

        console.log("Order created:", order)

        // Clear the cart after successful order creation
        await axios.post(`https://backend.gezeno.in/api/users/emptyCart/${userEmail}`)

        router.push("/myaccount/myorders")
      } else {
        router.push("/myaccount/myaddress")
      }
    } catch (error) {
      console.error("Error processing order:", error)
      router.push("/myaccount/myaddress")
    }
  }

  const calculateTotal = () => {
    return cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity - product.discountAmount
    }, 0)
  }

  const totalMRP = cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
  const bagDiscount = cartProducts.reduce((total, product) => total + (product.discountAmount || 0), 0)
  const deliveryFee = selectedPayment === "cod" ? 20 : 0
  const taxAmount = (totalMRP - bagDiscount) * 0.18 // 18% GST
  const subtotal = totalMRP - bagDiscount + deliveryFee + taxAmount

  if (cartError) return <div>Failed to load cart</div>
  if (!cart) return <div>Loading...</div>

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
              PAY ₹{cart?.total?.toFixed(2)}
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
              {cartProducts.map((product) => (
                <div key={product._id} className="flex justify-between items-center py-2">
                  <div>
                    <p>{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {product.quantity}, Size: {product.selectedSize || "N/A"}
                    </p>
                  </div>
                  <p>₹{(product.price * product.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">PRICE SUMMARY</h3>
            <div className="space-y-2">
              {cartProducts.map((product) => (
                <div key={product._id} className="flex justify-between text-sm">
                  <span>
                    {product.name} (x{product.quantity})
                  </span>
                  <span>₹{(product.price * product.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>Total MRP (Incl. of taxes)</span>
                <span>₹{cart?.subtotal?.toFixed(2)}</span>
              </div>
              {cart?.couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Applied ({cart.couponApplied.code})</span>
                  <span>-₹{cart.couponApplied.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{cart?.total?.toFixed(2)}</span>
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

