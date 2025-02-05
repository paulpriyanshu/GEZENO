"use client"
import { OfferBanner } from "@/components/offer-banner"
import { useEffect, useState } from "react"
import axios from "axios"
import NavBar from "@/components/NavBar"
import Loading from "../category/[name]/[id]/loading"

export default function OffersPage() {
  const [NavBarData,setNavBarData]=useState([])
  const [isLoading,setLoading]=useState(true)

  useEffect(()=>{
    const fetchData=async()=>{
     try {
       const homeresponse=await axios.get('https://backend.gezeno.in/api/home/config')
       setNavBarData(homeresponse.data.data)
     } catch (error) {
        console.log("error",error)
     }finally{
      setLoading(false)
     }
    }

    fetchData()
  },[])
  if(isLoading){
    return <Loading/>
  }
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar data={NavBarData}/>
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Gezeno Offers</h1>
            <p className="mt-2 text-muted-foreground">
              Find the best offers across our platforms on this page.
            </p>
          </div>
          <div className="mt-8 space-y-6 md:mt-12">
            <OfferBanner
              title="OVERSIZED T-SHIRTS"
              price="999"
              quantity={2}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/offers/oversized-tshirts"
            />
            <OfferBanner
              title="CLASSIC FIT T-SHIRTS"
              price="999"
              quantity={3}
              imageUrl="/placeholder.svg?height=400&width=400"
              href="/offers/classic-tshirts"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

