export default function ProductCards({ product }) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price
    const discountPercentage = hasDiscount
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  
    return (
      <div className="relative px-2 mb-4">
        <div className="relative group">
          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={product.images[0]?.url || "/placeholder.svg"}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-sm group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="mt-3">
            <h3 className="font-sans text-[#4F5362] text-sm">{product.brand.name}</h3>
            <p className="text-xs text-[#737373] font-light truncate">{product.name}</p>
            <div className="flex items-center mt-1">
              <span className="text-sm font-extrabold">₹{product.price}</span>
              {hasDiscount && (
                <>
                  <span className="ml-2 text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                  <span className="ml-2 text-green-500 text-sm">{discountPercentage}% off</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  