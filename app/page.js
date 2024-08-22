"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { navbar ,slides, products ,imageData,mainImages,secondRowImages, bannerItems, widgetItems, bannerImages, items, navbarMobileView } from './api/actions/photos';
import { Caramel } from 'next/font/google';
import BestPick from '@/components/BestPick';
import TooHotTobeMissed from '@/components/TooHotTobeMissed';
import { responsive,responsive_second,responsive_third,responsive_fourth,responsive_fifth, responsive_sixth } from '@/components/ResponsiveFeatures';
import NavBar from '@/components/NavBar';



export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);


    return () => clearInterval(timer);
  }, []);

  
  return (
    <div className="min-h-screen w-full">
      <div className="bg-white w-full shadow-sm">
        <NavBar/>
      
  <div className="w-full ">
    <div className="hidden xl:flex justify-center m-4 mx-10 ">

        {navbar.map((item) => (
          <div key={item} className='mx-auto'>
            <div href="#" className="text-sm lg:text-lg  text-black hover:text-gray-900">{item}</div>
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
        <div key={item} className="mx-auto">
          <a href="#" className="text-xs lg:text-lg text-black hover:text-gray-900">
            {item}
          </a>
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
       
        {navbarMobileView.map((item,index) => (
          <div key={index} className='m-2'>
            <img  src={item.imgSrc} className='mx-2 rounded-xl' />
            <h1 className='flex justify-center text-xs p-2'>{item.label}</h1>
          </div>
        ))}
       
       </Carousel>
        

   

  </div>
      </div>

      <div className='w-full overflow-hidden m-2'>
      <Carousel
  swipeable={true}
  draggable={true}
  showDots={true}
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
>
  {slides.map((slide, index) => (
    <div key={index} className="relative w-full h-[500px] md:h-[700px] lg:h-[1400px] xl:h-[800px] p-2 transition-opacity duration-1000 overflow-hidden mx-2">
      <img src={slide.image} alt={slide.title} className="absolute inset-0 w-11/12 h-full lg:w-full object-cover rounded-xl lg:rounded-none mx-2 lg:m-0" />
    </div>
  ))}
</Carousel>


      </div>

      <div className='mt-4'>
        <img src='718372747.webp' className='w-full' alt='show pic'/>
      </div>

      <h1 className='flex justify-center items-center font-semibold text-2xl md:text-3xl m-2'>
        Shop by Category-Men
      </h1>
      <div className="hidden md:grid grid-cols-6 gap-4">
        {imageData.map((image, index) => (
          <div key={index} className=''>
            <img src={image.image} width={400} height={300} layout="responsive"/>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <Carousel responsive={responsive_second}>
          {imageData.map((src, index) => (
            <div key={index} className="flex justify-center mx-2">
              <img src={src.image} alt={`Image ${index + 1}`} className="w-full h-auto rounded" />
            </div>
          ))}
        </Carousel>
      </div>

      <h1 className='flex justify-center text-2xl md:text-3xl font-semibold m-2'>
        Shop by Category- Women
      </h1>
      <div className='hidden md:grid grid-cols-6 gap-4 ml-10'>
        {[...mainImages, ...secondRowImages].map((image, index) => (
          <div key={index}>
            <img src={image} width={200} height={300} layout="responsive"/>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <Carousel responsive={responsive_second}>
          {[...mainImages, ...secondRowImages].map((src, index) => (
            <div key={index} className="flex justify-center mx-2">
              <img src={src} alt={`Image ${index + 1}`} className="w-full h-auto rounded" />
            </div>
          ))}
        </Carousel>
      </div>
      <h1 className='flex justify-center items-center font-semibold text-lg md:text-3xl m-2'>
        EFFORTLESSLY STYLISH BESTSELLERS
      </h1>
      
      <Carousel 
       responsive={responsive_second}>

        {products.map((image, index) => (
          <div key={index} className='mx-3'>
            <img src={image.imgSrc} width={500} height={500} layout="responsive"/>
          </div>
        ))}

      </Carousel>
        <h1 className='flex justify-center  text-3xl font-semibold m-3'>
          Gezeno Originals
        </h1>
       

      <Carousel swipeable={true}
       draggable={true}
       showDots={true}
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
       itemClass="carousel-item-padding-40-px">
       
        {bannerItems.map((images,index)=>(
          <div key={index} className='mx-3'>
            <img src={images.src} alt={images.href} className='w-full'/>
            </div>
        ))}
        </Carousel>

        <div className='hidden justify-center w-full m-10'>
        <div className='grid grid-cols-8'>
          
            
          {widgetItems.map((images,index)=>(
            <div key={index}>
              <img src={images.src} width={150} height={50} alt={index}/>

            </div>
          ))}

        
      </div>

      </div>
      <div className='md:hidden'>
        <Carousel swipeable={true}
       draggable={true}
       showDots={false}
       responsive={responsive_fourth}
       ssr={true} 
       infinite={true}
       autoPlay={true}      
       autoPlaySpeed={1000}  
       keyBoardControl={true}
       customTransition="transform 2.0s ease"
       transitionDuration={2000}
       containerClass="carousel-container"
       dotListClass="custom-dot-list-style flex justify-center mt-4"
       itemClass="carousel-item-padding-20-px">
       
      
          
            
          {widgetItems.map((images,index)=>(
            <div key={index}>
              <img src={images.src} width={150} height={50} alt={index}/>

            </div>
          ))}

        



        </Carousel>
      </div>
        <TooHotTobeMissed/>
        <BestPick/>
      
      <img src="https://images.bewakoof.com/uploads/grid/app/Desktop-Strip-3-1672040129.jpg" className='w-full mt-2' alt="banner-img"/>
      <img src="https://images.bewakoof.com/uploads/grid/app/Desktop-Strip-3-1669022420.jpg" className='w-full mt-10' alt="banner-img"/>

        
      </div>
    
     
  );
}