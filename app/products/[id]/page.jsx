import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Header from "./Header"
import ProductGallery from "./product-gallery"
import ProductInfo from "./product-info"
import RelatedProducts from "./related-products"
import axios from "axios"

async function getProduct(id) {
  const res = await fetch(`https://backend.gezeno.in/api/products/${id}`)
  if (!res.ok) throw new Error("Failed to fetch product")
  return res.json()
}

async function getRelatedProducts(category) {
  const res = await axios.get(`https://backend.gezeno.in/api/productOfCategory/${category}`)

    console.log("category",res.data)
  return res.data
}

// async function getCategoryName(category){
//   const res=await axios.get(``)
// }

async function getHomeConfig() {
  const res = await axios.get("https://backend.gezeno.in/api/home/headers", {
    cache: "no-store",
  })
  return res
}

export default async function ProductPage({ params }) {
  // Fetch all data in parallel
  const [homeconfig, product] = await Promise.all([
    getHomeConfig(),
    getProduct(params.id),
  ])
  console.log("product",product)
  const relatedData = await getRelatedProducts(product.category)

  return (
    <div className="mx-auto md:mx-10">
      {/* Pass preloaded home config data to Header */}
      <Header homeconfig={homeconfig.data} />

      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/category/${encodeURIComponent(relatedData.category.name)}/${relatedData.category._id}`} className="hover:text-primary">{relatedData.category.name}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name.slice(0,100)}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>

        <RelatedProducts products={relatedData.products} />
      </div>
    </div>
  )
}