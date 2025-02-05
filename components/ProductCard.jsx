import { Heart } from 'lucide-react'

export default function ProductCard({
  image,
  name,
  brand,
  price,
  originalPrice,
  rating,
  onClick
}) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <div className="w-full max-w-[300px] bg-white shadow  overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img
          src={image}
          alt={name}
          width={300}
          height={300}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute left-2 top-2 bg-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
          OVERSIZED FIT
        </div>
        <button className="absolute right-2 top-2 text-gray-600">
          <Heart className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-medium text-gray-700">{rating}</span>
        </div>
        <h3 className="text-[12px] font-extrabold text-black">{brand}</h3>
        <p className="text-sm text-gray-600 truncate">{name}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">₹{price}</span>
          <span className="text-sm text-gray-500 line-through">₹{price+500}</span>
          <span className="text-sm font-semibold text-green-600">{30}% off</span>
        </div>
        <div className="inline-block border border-gray-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">
          100% COTTON
        </div>
      </div>
    </div>
  )
}

