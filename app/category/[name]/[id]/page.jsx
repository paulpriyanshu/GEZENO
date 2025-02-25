import { Suspense } from "react"
import { notFound } from "next/navigation"
import NavBar from "@/components/NavBar"
import TopHeader from "@/components/TopHeader"
import CategoryContent from "@/components/category-content"
import MobileHeader from "@/components/MobileHeader"
import MobileFooter from "@/components/MobileFooter"
import Loading from "./loading"


async function getCategoryData(id) {
  try {
    const [homeConfigResponse, categoryResponse] = await Promise.all([
      fetch("https://backend.gezeno.in/api/home/headers", { next: { revalidate: 3600 } }),
      fetch(`https://backend.gezeno.in/api/products/productOfCategory/${id}`, { next: { revalidate: 3600 } }),
    ])

    if (!categoryResponse.ok) {
      throw new Error("Failed to fetch category")
    }

    const homeConfig = await homeConfigResponse.json()
    const categoryData = await categoryResponse.json()

    return {
      navBarData: homeConfig,
      categoryData: categoryData.category,
      products: categoryData.products,
    }
  } catch (error) {
    return null
  }
}

function calculateAvailableFilters(products) {
  const availableFilters = products.reduce(
    (acc, product) => {
      // Process filters
      product.filters.forEach((filter) => {
        if (!acc[filter.filter.name]) {
          acc[filter.filter.name] = new Set()
        }
        acc[filter.filter.name].add(filter.filter.name)
        filter.tags.forEach((tag) => acc[filter.filter.name].add(tag))
      })

      // Process sizes
      if (!acc["sizes"]) {
        acc["sizes"] = new Set()
      }
      product.sizes.forEach((size) => {
        size.tags.forEach((tag) => acc["sizes"].add(tag))
      })

      // Process brands
      if (!acc["brands"]) {
        acc["brands"] = new Set()
      }
      if (product.brand) {
        acc["brands"].add(product.brand.name)
      }

      // Process price range
      if (!acc["priceRange"]) {
        acc["priceRange"] = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
      }
      acc["priceRange"].min = Math.min(acc["priceRange"].min, product.price)
      acc["priceRange"].max = Math.max(acc["priceRange"].max, product.price)

      return acc
    },
    {},
  )

  // Convert Sets to Arrays
  Object.keys(availableFilters).forEach((key) => {
    if (key !== "priceRange") {
      availableFilters[key] = Array.from(availableFilters[key])
    }
  })

  return availableFilters
}

export default async function CategoryPage({ params }) {
  const data = await getCategoryData(params.id)

  if (!data) {
    notFound()
  }

  const availableFilters = calculateAvailableFilters(data.products)

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <TopHeader />
        <NavBar data={data.navBarData} />
      </div>

      <div className="md:hidden">
        <MobileHeader filters={availableFilters} />
      </div>

      <Suspense fallback={<Loading />}>
        <CategoryContent
          categoryData={data.categoryData}
          products={data.products}
          availableFilters={availableFilters}
        />
        <CategoryDescription category={data.categoryData}/>
        
      </Suspense>

      <div className="md:hidden">
        <MobileFooter />
      </div>
    </div>
  )
}

function CategoryDescription({ category }) {
  return (
    <div className="mt-16 space-y-6 md:px-24 p-5">
      <h2 className="text-xl font-semibold">{category?.name}</h2>
      <h3 className="text-lg font-medium text-gray-400">SHOP LATEST {category?.name?.toUpperCase()} ONLINE IN INDIA</h3>

      <div className="prose prose-gray max-w-none space-y-4">
        <p className="text-gray-500">
          Looking for versatility? Our {category?.name?.toLowerCase()} are designed to complement both casual and
          semi-formal looks, making them a must-have in every wardrobe. Whether you&apos;re heading out for a weekend
          adventure or a casual day at the office, Gezeno&apos;s {category?.name?.toLowerCase()}
          provide the perfect finishing touch.
        </p>

        <p className="text-gray-400">
          Crafted with high-quality materials, these {category?.name?.toLowerCase()}
          offer durability and support, making them ideal for daily wear. Additionally, with our regular discounts and
          offers, upgrading your collection has never been more affordable.
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">WHY CHOOSE Gezeno&apos;s {category?.name?.toUpperCase()}:</h3>

          <div>
            <h4 className="text-lg font-semibold mb-2">STYLISH DESIGNS:</h4>
            <p className="text-gray-400">
              At Gezeno, we know how important it is to stay on trend. Our
              {category?.name?.toLowerCase()} come in a variety of modern designs that easily match any outfit. Whether
              you&apos;re into classic looks or something more eye-catching, we&apos;ve got options that suit your
              style.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
