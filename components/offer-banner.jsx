// import img from "next/image"
import Link from "next/link"



export function OfferBanner({ title, price, quantity, imageUrl, href }) {
  return (
    <Link href={href}>
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <div className="flex items-center justify-between">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-lg font-semibold">BUY {quantity} AT</p>
              <p className="text-4xl font-bold md:text-6xl">₹{price}</p>
            </div>
          </div>
          <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
            <img
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

