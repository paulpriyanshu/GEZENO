"use client"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import NavBar from "@/components/NavBar"

// Function to fetch terms and conditions
async function getTermsAndConditions() {
  try {
    const res = await axios.get("https://backend.gezeno.in/api/terms-and-conditions", {
      headers: { "Content-Type": "application/json" },
    })
    if (res.status === 404) {
      notFound()
    }
    console.log("res",res.data.returns)
    return res.data.returns // Assuming the HTML content is in `data`
  } catch (error) {
    throw new Error('Failed to fetch terms')
  }
}                   

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-full"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-full"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-full"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div> 
    <div className="h-4 bg-gray-300 rounded w-full"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div> 
    <div className="h-4 bg-gray-300 rounded w-full"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
  </div>
)

export default function TermsOfService() {
  const [terms, setTerms] = useState(null)
  const [navBarData, setNavBarData] = useState([])
  const [loading, setLoading] = useState(true)  // State to track loading of the navbar data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTermsAndConditions()
        setTerms(data)
      } catch (error) {
        console.error("Error fetching terms:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const homeConfigResponse = await axios.get('https://backend.gezeno.in/api/home/headers')
        setNavBarData(homeConfigResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)  // Set loading to false when data is fetched
      }
    }
    fetchHeader()
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
    <NavBar data={navBarData}/>
        <div className="max-w-4xl mx-auto px-4 py-12">
       
       <h1 className="flex justify-center w-full text-3xl">Returns Order</h1>
     <div
       className="prose" // Apply the prose class for rich text formatting
       dangerouslySetInnerHTML={{ __html: terms }}
     />
   </div>
    </>

  )
}