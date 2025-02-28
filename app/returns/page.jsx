import { notFound } from "next/navigation"
import NavBar from "@/components/NavBar"

// Function to fetch terms and conditions (Server-Side)
async function getTermsAndConditions() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/products/terms-and-conditions", {
      next:{revalidate:5}
  })

    if (res.status === 404) {
      notFound()
    }

    const data = await res.json()
    return data.returns  // Assuming the response has HTML content
  } catch (error) {
    throw new Error("Failed to fetch terms")
  }
}

// Function to fetch navbar data (Server-Side)
async function getNavBarData() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/home/headers")

    return await res.json()
  } catch (error) {
    console.error("Error fetching navbar data:", error)
    return []
  }
}

export default async function TermsOfService() {
  const terms = await getTermsAndConditions()
  const navBarData = await getNavBarData()

  return (
    <>
      <NavBar data={navBarData} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="flex justify-center w-full text-3xl">Returns Order</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: terms }} />
      </div>
    </>
  )
}