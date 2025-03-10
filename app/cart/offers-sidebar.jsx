import * as React from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet"

export function OfferCard({ title, code, description, validUntil, discount, onApply }) {
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="bg-primary p-4">
        <h3 className="text-primary-foreground font-medium">{title}</h3>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm mb-1">{description}</p>
            <p className="text-xs text-muted-foreground">Valid till {validUntil}</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg">{discount}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{code}</span>
          </div>
          <Button 
            onClick={() => onApply(code)} 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            APPLY
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function OffersSidebar({ open, onOpenChange, onApplyCoupon }) {
  const [offers, setOffers] = React.useState([]);

  React.useEffect(() => {
    fetch("https://backend.gezeno.in/api/getAllCoupons")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const mappedOffers = data.data.map(offer => ({
            id: offer._id,
            title: offer.code, // Using code as title since there's no name field
            code: offer.code,
            description: `Minimum order value ₹${offer.minOrderValue}`,
            validUntil: new Date(offer.endDate).toLocaleDateString(),
            discount: offer.discountType === "percentage" 
              ? `${offer.discountValue}% OFF` 
              : `Save ₹${offer.discountValue}`
          }));
          setOffers(mappedOffers);
        }
      })
      .catch(error => console.error("Error fetching offers:", error));
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-auto">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle>Offers</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm mb-2">Select a promo <span className="text-muted-foreground text-xs">{offers.length} applicable</span></p>
          </div>
          <div className="space-y-4">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                title={offer.title} // Now using offer.code as title
                code={offer.code}
                description={offer.description}
                validUntil={offer.validUntil}
                discount={offer.discount}
                onApply={onApplyCoupon}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}