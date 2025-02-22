"use client"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import NavBar from "@/components/NavBar"

// Function to fetch terms and conditions with caching
async function getTermsAndConditions() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/terms-and-conditions",{
      next:{revalidate:5}
    })

    if (!res.ok) {
      if (res.status === 404) {
        notFound()
      }
      throw new Error("Failed to fetch terms")
    }

    const data = await res.json()
    return data.terms // Assuming `terms` contains the HTML content
  } catch (error) {
    console.error("Error fetching terms:", error)
    return null
  }
}

// Function to fetch navbar data with caching
async function getNavBarData() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/home/headers")

    if (!res.ok) {
      throw new Error("Failed to fetch navbar data")
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching navbar data:", error)
    return []
  }
}

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    {Array(10).fill(null).map((_, index) => (
      <div key={index} className="h-4 bg-gray-300 rounded w-full"></div>
    ))}
  </div>
)

export default function TermsOfService() {
  const [terms, setTerms] = useState<string | null>(null)
  const [navBarData, setNavBarData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [termsData, navData] = await Promise.all([
        getTermsAndConditions(),
        getNavBarData(),
      ])

      setTerms(termsData)
      setNavBarData(navData)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading || !terms) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <SkeletonLoader />
      </div>
    )
  }

  return (
    <>
      <NavBar data={navBarData} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="flex justify-center w-full text-3xl">Terms Of Service</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: terms }} />
      </div>
    </>
  )
}