"use client"

import { createContext, useState, useContext, useEffect } from "react"

const ProductContext = createContext(null)

export function ProductProvider({ children, initialProduct }) {
  const [product, setProduct] = useState(initialProduct)
  const [selectedVariant, setSelectedVariant] = useState(initialProduct.variants[0] || null)
  const [currentImages, setCurrentImages] = useState(initialProduct.images)

  useEffect(() => {
    if (selectedVariant) {
      setCurrentImages(
        selectedVariant.images && selectedVariant.images.length > 0 ? selectedVariant.images : product.images,
      )
    } else {
      setCurrentImages(product.images)
    }
  }, [selectedVariant, product])

  return (
    <ProductContext.Provider
      value={{
        product,
        selectedVariant,
        setSelectedVariant,
        currentImages,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
}

