
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon, PackageIcon, RefreshCcwIcon } from "lucide-react"
import  CardFooter  from "@/components/CheckoutFooter"
import NavBar from "@/components/NavBar"
import CheckoutFooter from "@/components/CheckoutFooter"

export default function Page() {  
  return (
    <>
    <NavBar/>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bag2 item(s)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className=" border border-l-slate-200">
            <div className="p-6">
              <div className="flex gap-4">
              <img 
                  src="https://images.bewakoof.com/t320/men-s-black-all-over-printed-pyjama-608420-1697626367-1.jpg" 
                  alt="cart-image" 
                  className="md:w-1/5 md:h-1/5 w-1/3 h-1/3"
                />


                <div className="flex-1">
                  <h2 className="text-lg font-semibold">Men&#39;s White All Over Printed Pyjamas</h2>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-xl font-bold">₹709</p>
                      <p className="text-sm line-through text-gray-500">₹1,419</p>
                      <p className="text-green-600">You saved ₹900!</p>
                    </div>
                    <div>
                      <p>Size: S</p>
                      <p>Qty: 1</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Delivery by 22 Jul 2024</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div>
        <div className="mb-4 border border-slate-300">
        <CardContent className="p-4">
          <p className="text-sm">
            Whistles! Get extra 10% cashback on all prepaid orders above Rs.499. Use Code - PREP10.
          </p>
        </CardContent>
      </div>

      <div className="mb-4 bg-[#f0f7f7]">
        <div className="px-4 flex items-center">
          <div className="text-[#38b2ac] text-xs w-full">Apply Coupon/Gift Card/Referral</div>
          <Button variant="link" className="text-[#38b2ac] font-bold">
            Redeem »
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-sm">PRICE SUMMARY</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total MRP (Incl. of taxes)</span>
              <span>₹2448</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bag Discount</span>
              <span>- ₹1500</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Subtotal</span>
              <span>₹948</span>
            </div>
          </div>
        </CardContent>
        <CardContent className="bg-[#e6f3f3] p-2 text-center text-black">
          You are saving ₹ 1500 on this order
        </CardContent>
        <div className="p-2 mt-4 bg-blue-50">
          <div className="flex items-center w-full ">
          <img src="icon-free-delivery.svg" alt="delivery info" class="gh-df-img-free"/>
            <span className="font-semibold text-sm ">Yay! You get FREE delivery on this order</span>
          </div>
        </div>
        <CardFooter className="p-4">
          <div className="w-full flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">Total</div>
              <div className="text-sm font-bold">₹948</div>
            </div>
            <Button className="bg-[#38b2ac] hover:bg-[#319795] text-black px-12 py-6 text-lg">
              Proceed
            </Button>
          </div>
        </CardFooter>
      </Card>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <LockIcon className="mx-auto h-6 w-6 text-gray-400" />
              <p>100% SECURE PAYMENTS</p>
            </div>
            <div>
              <RefreshCcwIcon className="mx-auto h-6 w-6 text-gray-400" />
              <p>EASY RETURNS & QUICK REFUNDS</p>
            </div>
            <div>
              <PackageIcon className="mx-auto h-6 w-6 text-gray-400" />
              <p>QUALITY ASSURANCE</p>
            </div>
          </div>
          <img src="Payment-trust-banner.svg" alt="payment" className="mt-5 rounded-xl"/>
        </div>
        
      </div>

      <CheckoutFooter/>
     
    
    </div>
   
   
    </>
  )
}