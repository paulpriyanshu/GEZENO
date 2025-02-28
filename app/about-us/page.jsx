import { notFound } from "next/navigation"
import axios from "axios"
import NavBar from "@/components/NavBar"

// ✅ Fetch Terms & Conditions on the Server Side
async function getTermsAndConditions() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/products/terms-and-conditions", {
        next:{revalidate:5}
    })
    if (!res.ok) {
      notFound()
    }
    const data = await res.json()
    return data.aboutus
  } catch (error) {
    console.error("Failed to fetch terms:", error)
    return null
  }
}

// ✅ Fetch Navbar Data on the Server Side
async function getNavBarData() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/home/headers")
    if (!res.ok) throw new Error("Failed to fetch navbar data")
    return res.json()
  } catch (error) {
    console.error("Error fetching navbar data:", error)
    return []
  }
}

// ✅ Server Component (No useEffect needed)
export default async function TermsOfService() {
  const terms = await getTermsAndConditions()
  const navBarData = await getNavBarData()

  if (!terms) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-red-500">Error fetching terms and conditions.</p>
      </div>
    )
  }

  return (
    <>
      <NavBar data={navBarData} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="flex justify-center w-full text-3xl">About Us</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: terms }} />
      </div>
    </>
  )
}