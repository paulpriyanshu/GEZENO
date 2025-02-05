import { Suspense } from "react"
import getHomeData  from "./api/homeData"
import HomeContent from "@/components/HomeContent"
import LoadingSpinner from "@/components/LoadingSpinner"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  const { homeConfig, submenu, headers } = await getHomeData()
  console.log("home Config",homeConfig)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent homeConfigData={homeConfig} submenuData={submenu} headersData={headers} />
    </Suspense>
  )
}

