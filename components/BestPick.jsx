import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive_third } from './ResponsiveFeatures';
import { bannerImages } from '@/app/api/actions/photos';
import { items } from '@/app/api/actions/photos';
function BestPick() {
  return (
    <div>
        <div className='m-10'>
      <h1 className='flex justify-center text-2xl m-2 font-semibold lg:text-3xl'>
        Our Best Picks
      </h1>
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
        {items.map((images,index)=>(
          <div key={index}>
            <img src={images.src}/>
          </div>
        ))}
        </Carousel>
      </div>
      
    </div>
  )
}

export default BestPick