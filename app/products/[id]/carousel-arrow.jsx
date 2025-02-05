import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"


export function CustomCarouselArrow({ onClick, direction, className }) {
  return (
    <Button
      variant="secondary"
      size="icon"
      className={`absolute z-10 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full ${
        direction === "left" ? "left-4" : "right-4"
      } ${className}`}
      onClick={onClick}
    >
      {direction === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  )
}

