"use client"

import { useState, useEffect } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import {
  responsive,
  responsive_second,
  responsive_third,
  responsive_fifth,
  responsive_sixth,
  responsive_eigth,
} from "@/components/ResponsiveFeatures"
import NavBar from "@/components/NavBar"
import { useAppSelector } from "../app/lib/hooks"
import TopHeader from "@/components/TopHeader"
import MobileHomeFooter from "@/components/MobileHomeFooter"
import HomeSideBar from "@/components/HomeSideBar"
import { useRouter } from "next/navigation"
import CategorySection from "@/components/CategorySection"
import RenderCategories from "@/components/RenderCategory"







function ProductCategory({ products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return null
  }

  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(product)
    return acc
  }, {})

  return (
    <div className="w-full py-12">
      <div className="container px-4 md:px-6">
        {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <CategorySection key={category} title={category} products={categoryProducts} />
        ))}
      </div>
    </div>
  )
}

export default function HomeContent({ homeConfigData, submenuData, headersData,categories }) {
  const [homeConfig, setHomeConfig] = useState({})
  const [slideImages, setSlideImages] = useState([])
  const [bannerImages, setBannerImages] = useState([])
  const [customSections, setCustomSections] = useState([])
  const [gezenoOriginalsImages, setGezenoOriginalsImages] = useState([])
  const [WidgetsImage, setWidgetsImage] = useState([])
  const [tooHotToBeMissedImages, setTooHotToBeMissedImages] = useState([])
  const [ourBestPicksImages, setOurBestPicksImages] = useState([])
  const [navBarData, setNavBarData] = useState(null)
  const [navbar, setNavbar] = useState([])
  const router = useRouter() 

  const isOpensidebar = useAppSelector((state) => state.homesidebar.isOpen)
  const isMobileSearch = useAppSelector((state) => state.mobilesearch.isVisible)

  useEffect(() => {
    if (homeConfigData && submenuData && headersData) {
      const data = homeConfigData.data
      const menudata = submenuData.data

      setNavbar(menudata)
      setHomeConfig(data)
      setSlideImages(data.carousel?.map((item) => item.categoryData).filter(Boolean))
      setBannerImages(data.banners?.map((banner) => banner).filter(Boolean))
      setCustomSections(data.customSections?.map((item) => item).filter(Boolean))
      setGezenoOriginalsImages(data.gezenoOriginals?.map((item) => item.categoryData).filter(Boolean))
      setWidgetsImage(data.widgets.map((item) => item.categoryData).filter(Boolean))
      setTooHotToBeMissedImages(data.tooHotToBeMissed?.map((item) => item.categoryData).filter(Boolean))
      setOurBestPicksImages(data.ourBestPicks?.map((item) => item.categoryData).filter(Boolean))
      setNavBarData(headersData)
      // console.log("menu items",categories)
    }
  }, [homeConfigData, submenuData, headersData])


  return (
    <>
      <div className="min-h-screen w-full">
        <HomeSideBar isOpen={isOpensidebar} menuItems={categories} />
        <div className="hidden md:block">
          <TopHeader />
        </div>

        <div className="bg-white w-full shadow-sm">
          <NavBar data={navBarData} />

          <div className="w-full ">
            <div className="hidden xl:flex justify-center m-4 mx-10 ">
              {navbar.map((item) => (
                <div key={item} className="mx-auto px-2 hover:cursor-pointer">
                  <div
                    className="text-sm lg:text-lg  text-black hover:text-gray-900"
                    onClick={() =>
                      router.push(`/category/${encodeURIComponent(item.categoryData.name)}/${item.categoryData._id}`)
                    }
                  >
                    {item.categoryData.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block xl:hidden m-3">
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive_sixth}
              ssr={true}
              infinite={false}
              autoPlay={false}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              customTransition="transform 2.0s ease"
              transitionDuration={1000}
              arrows={false}
            >
              {navbar.map((item) => (
                <div
                  key={item}
                  className="mx-auto hover:cursor-pointer"
                  onClick={() => router.push(`/category/${item.categoryData.name}/${item._id}`)}
                >
                  <div className="text-xs lg:text-lg text-black hover:text-gray-900">{item.categoryData.name}</div>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="w-full  md:hidden">
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive_fifth}
              ssr={true}
              infinite={false}
              autoPlay={false}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              customTransition="transform 2.0s ease"
              transitionDuration={1000}
              arrows={false}
            >
              {navbar.map((item, index) => (
                <div key={index} className="m-2">
                  <img src={item.categoryData.image || "/placeholder.svg"} className="mx-2 rounded-xl" />
                  <h1 className="flex justify-center text-xs p-2">{item.categoryData.name}</h1>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        <div className="w-full overflow-hidden m-2 relative">
          <Carousel
            swipeable={true}
            draggable={true}
            showDots={false}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="transform 2.0s ease"
            transitionDuration={1000}
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style flex justify-center mt-4"
            arrows={false}
          >
            {slideImages.map((slide, index) => (
              <div
                key={index}
                className="relative w-full h-[500px] md:h-[700px] lg:h-[1400px] xl:h-[800px] p-2 transition-opacity duration-1000 overflow-hidden mx-2"
                onClick={() => router.push(`/category/${encodeURIComponent(slide.name)}/${slide._id}`)}
              >
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={`Slide ${index + 1}`}
                  className="w-11/12 h-full lg:w-full object-cover rounded-xl lg:rounded-none mx-2 lg:m-0"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {bannerImages.length > 0 && (
          <div className="hidden mt-4 md:block">
            <img
              src={bannerImages[0].url || "/placeholder.svg"}
              className="w-full"
              alt="show pic"
              onClick={() => router.push(bannerImages[0].redirectUrl)}
            />
          </div>
        )}
        {bannerImages.length > 1 && (
          <div className="flex justify-center m-5 mt-10 md:hidden">
            <img
              src={bannerImages[1].url || "/placeholder.svg"}
              className="w-full rounded-xl"
              alt="banner"
              onClick={() => router.push(bannerImages[0].redirectUrl)}
            />
          </div>
        )}

        <div>
          {customSections.length === 0 ? (
            <div>No categories available</div>
          ) : (
            customSections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="flex justify-center items-center font-semibold text-2xl md:text-3xl m-2">
                  Shop by Category - {section.categoryData?.name || "Unknown Category"}
                </h2>
                <RenderCategories category={section.categoryData}/>
              </div>
            ))
          )}
        </div>

        {gezenoOriginalsImages?.length > 0 && (
          <div>
            <h1 className="flex justify-center  text-3xl font-semibold m-10">Gezeno Originals</h1>
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive_third}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              customTransition="transform 2.0s ease"
              transitionDuration={1000}
              containerClass="carousel-container"
              dotListClass="custom-dot-list-style flex justify-center mt-4"
              itemClass="carousel-item-padding-40-px"
              arrows={false}
            >
              {gezenoOriginalsImages.map((images, index) => (
                <div key={index} className="mx-3">
                  <img
                    src={images.image || "/placeholder.svg"}
                    alt={images.href}
                    className="w-full"
                    onClick={() => router.push(`/category/${images._id}`)}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {WidgetsImage?.length > 0 && (
          <>
            <div className="hidden justify-center">
              {WidgetsImage.map((widget, index) => (
                <div key={index} className="m-5 my-10">
                  <img
                    src={widget.image || "/placeholder.svg"}
                    width={150}
                    height={50}
                    alt={index}
                    onClick={() => router.push(`/category/${widget._id}`)}
                  />
                </div>
              ))}
            </div>
            <div className="m-5">
              <Carousel responsive={responsive_eigth} arrows={false}>
                {WidgetsImage.map((widget, index) => (
                  <div key={index} className="mx-2">
                    <img
                      src={widget.image || "/placeholder.svg"}
                      width={200}
                      height={100}
                      alt={index}
                      onClick={() => router.push(`/category/${widget._id}`)}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </>
        )}

        {tooHotToBeMissedImages?.length > 0 && (
          <div>
            <h1 className="flex justify-center text-2xl font-semibold m-3 lg:text-3xl">TOO HOT TO BE MISSED</h1>
            <Carousel
              swipeable={true}
              draggable={false}
              showDots={false}
              responsive={responsive_third}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={2000}
              keyBoardControl={true}
              customTransition="transform 2.0s ease"
              transitionDuration={2000}
              containerClass="carousel-container"
              dotListClass="custom-dot-list-style flex justify-center mt-4"
              itemClass="carousel-item-padding-40-px"
              arrows={false}
            >
              {tooHotToBeMissedImages.map((images, index) => (
                <div key={index}>
                  <img
                    src={images.image || "/placeholder.svg"}
                    alt={index}
                    onClick={() => router.push(`/category/${images._id}`)}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {ourBestPicksImages?.length > 0 && (
          <div className="m-10">
            <h1 className="flex justify-center text-2xl m-2 font-semibold lg:text-3xl">Our Best Picks</h1>
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive_third}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              customTransition="transform 2.0s ease"
              transitionDuration={1000}
              containerClass="carousel-container"
              dotListClass="custom-dot-list-style flex justify-center mt-4"
              itemClass="carousel-item-padding-40-px"
              arrows={false}
            >
              {ourBestPicksImages.map((images, index) => (
                <div key={index}>
                  <img
                    src={images.image || "/placeholder.svg"}
                    onClick={() => router.push(`/category/${images._id}`)}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}
        {bannerImages?.length > 0 && (
          <div>
            {bannerImages.slice(1).map((items, index) => (
              <div
                key={index}
                className="mt-2 clickable"
                onClick={() => {
                  const redirectUrl =
                    items.redirectUrl.startsWith("http://") || items.redirectUrl.startsWith("https://")
                      ? items.redirectUrl
                      : `https://gezeno.in${items.redirectUrl.startsWith("/") ? "" : "/"}${items.redirectUrl}`

                  window.location.href = redirectUrl
                }}
              >
                <img src={items.url || "/placeholder.svg"} className="w-full" alt={`banner-img-${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="block md:hidden">
        <MobileHomeFooter />
      </div>
    </>
  )
}

