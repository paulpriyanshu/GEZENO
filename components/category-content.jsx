"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import CategorySideBar from "@/components/CategorySideBar"
import ProductCard from "@/components/ProductCard"



export default function CategoryContent({ categoryData, products, availableFilters }) {
  const [filters, setFilters] = useState({})
  const [selectedSort, setSelectedSort] = useState("Popular")
  const router = useRouter()

  // Memoized filter function
  const filterProducts = useCallback((product, filters) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value.length === 0) return true

      switch (key) {
        case "sizes":
          return product.sizes.some((size) => size.tags.some((tag) => value.includes(tag)))
        case "brands":
          return value.includes(product.brand?.name)
        case "priceRange":
          return product.price >= value[0] && product.price <= value[1]
        default:
          return product.filters.some(
            (filter) =>
              filter.filter.name === key &&
              (value.includes(filter.filter.name) || filter.tags.some((tag) => value.includes(tag))),
          )
      }
    })
  }, [])

  // Memoized sort function
  const sortProducts = useCallback((a, b, sortType) => {
    switch (sortType) {
      case "Popular":
        return b.popularity - a.popularity
      case "New":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "PriceLowToHigh":
        return a.price - b.price
      case "PriceHighToLow":
        return b.price - a.price
      default:
        return 0
    }
  }, [])

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => filterProducts(product, filters))
      .sort((a, b) => sortProducts(a, b, selectedSort))
  }, [products, filters, selectedSort, filterProducts, sortProducts])

  const handleFilterChange = useCallback((filterType, selectedOptions) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: selectedOptions,
    }))
  }, [])

  const handleSortChange = useCallback((sortType) => {
    setSelectedSort(sortType)
  }, [])

  const handleProductClick = useCallback(
    (productId) => {
      router.push(`/products/${productId}`)
    },
    [router],
  )

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-primary transition-colors">
          Home
        </a>
        <span>/</span>
        <span>{categoryData?.name}</span>
      </div>

      {/* Category Title */}
      <h1 className="hidden md:block text-3xl font-bold mb-6">
        {categoryData?.name} ({filteredProducts.length})
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <h1 className="text-xl font-semibold text-gray-600">No products available</h1>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row flex-grow">
          {/* Sidebar Filters */}
          <div className="hidden md:block md:w-1/4 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
            <CategorySideBar
              availableFilters={availableFilters}
              onFilterChange={handleFilterChange}
              products={products}
              selectedFilters={filters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 md:ml-8">
            {/* Sort Controls */}
            <div className="mb-6 flex justify-end">
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Popular">Popular</option>
                <option value="New">Newest First</option>
                <option value="PriceLowToHigh">Price: Low to High</option>
                <option value="PriceHighToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Category Banner */}
            {categoryData?.image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src="https://images.bewakoof.com/uploads/category/desktop/INSIDE_DESKTOP_BANNER_pajamas_-1719554491.jpg" 
                  alt={`${categoryData.name} category banner`}
                  width={1200}
                  height={400}
                  className="w-full object-cover"
                />
              </div>

            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  image={product.images[0]?.url}
                  price={product.price}
                  product={product}
                  onClick={() => handleProductClick(product._id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products match your selected filters.</p>
                <button onClick={() => setFilters({})} className="mt-4 text-primary hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Description */}
      {/* <CategoryDescription category={categoryData} /> */}
    </main>
  )
}

// Category Description Component

