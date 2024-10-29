import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive_third } from './ResponsiveFeatures';
import { bannerImages } from '@/app/actions/photos';

function TooHotTobeMissed() {
  return (
    <div><div>
    <h1 className='flex justify-center text-2xl font-semibold m-3 lg:text-3xl'> 
      TOO HOT TO BE MISSED 
    </h1>
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
      {bannerImages.map((images,index)=>(
          (
            <div key={index}>
                <img src={images.src} alt={index}/>
            
            </div>
          )
      ))}
      </Carousel>

  </div>
</div>
  )
}

export default TooHotTobeMissed