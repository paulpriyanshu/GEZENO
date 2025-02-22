import { notFound } from "next/navigation"
import NavBar from "@/components/NavBar"
import { revalidate } from "../page"

// Function to fetch terms and conditions
async function getTermsAndConditions() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/terms-and-conditions",{
        next:{revalidate:5}
    })
    if (!res.ok) {
      if (res.status === 404) notFound()
      throw new Error("Failed to fetch terms")
    }   
    const data = await res.json()
    console.log("new data",data)
    return data.contactus // Assuming HTML content is in `contactus`
  } catch (error) {
    console.error("Error fetching terms:", error)
    return null // Return null in case of an error
  }
}

// Function to fetch navbar data
async function getNavBarData() {
  try {
    const res = await fetch("https://backend.gezeno.in/api/home/headers")
    if (!res.ok) throw new Error("Failed to fetch navbar data")
    return await res.json()
  } catch (error) {
    console.error("Error fetching navbar data:", error)
    return [] // Return empty array if there's an error
  }
}

export default async function TermsOfService() {
  const terms = await getTermsAndConditions()
  const navBarData = await getNavBarData()

  if (!terms) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-red-500">
        <h1 className="text-3xl">Error</h1>
        <p>Failed to load terms and conditions.</p>
      </div>
    )
  }

  return (
    <>
      <NavBar data={navBarData} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="flex justify-center w-full text-3xl">Contact Us</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: terms }} />
      </div>
    </>
  )
}