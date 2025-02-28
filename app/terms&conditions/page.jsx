import { notFound } from "next/navigation"
import NavBar from "@/components/NavBar"

// Function to fetch terms and conditions
async function getTermsAndConditions() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/products/terms-and-conditions", {
      next: { revalidate: 5 }, // Cache revalidation
    })

    if (!res.ok) {
      if (res.status === 404) {
        notFound()
      }
      throw new Error("Failed to fetch terms")
    }

    const data = await res.json()
    return data.terms // Assuming `terms` contains HTML content
  } catch (error) {
    console.error("Error fetching terms:", error)
    return null
  }
}

// Function to fetch navbar data
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

// Server Component
export default async function TermsOfService() {
  const [terms, navBarData] = await Promise.all([
    getTermsAndConditions(),
    getNavBarData(),
  ])

  if (!terms) {
    return notFound()
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