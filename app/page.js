"use client"
import { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { navbar ,slides, products ,imageData,mainImages,secondRowImages, bannerItems, widgetItems, bannerImages, items, navbarMobileView } from './api/actions/photos';
import BestPick from '@/components/BestPick';
import TooHotTobeMissed from '@/components/TooHotTobeMissed';
import { responsive,responsive_second,responsive_third,responsive_fourth,responsive_fifth, responsive_sixth, responsive_seventh, responsive_eigth } from '@/components/ResponsiveFeatures';
import NavBar from '@/components/NavBar';
import { useAppSelector } from './lib/hooks';
import TopHeader from '@/components/TopHeader';
import MobileHomeFooter from '@/components/MobileHomeFooter';
import MobileFooterDropdown  from '@/components/MobileFooterDropDown';
import HomeSIdeBarSlice from './lib/store/features/homesidebar/HomeSIdeBarSlice';
import HomeSideBar from '@/components/HomeSideBar';
import Footer from '@/components/Footer';
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [signedup,setsignup]=useState(false)
  const [email,setEmail]=useState("")
  const [otp,setOtp]=useState("")
  const handleSubmit=()=>{}
  const user_email=useAppSelector(state=>state.number.email)
  const isOpensidebar=useAppSelector(state=>state.homesidebar.isOpen)
  if(user_email) localStorage.setItem('user_email',user_email)
  console.log("this is user_email",user_email)
  console.log("this email has been set"),email
  const handleOtpClick=async()=>{
    try {
      console.log("this email has been set"),email
      const response = await axios.post('http://localhost:8080/api/verify-otp', {
          email,
          otp
      });
      if (response.data.success) {
          console.log('Logged in successfully:', response.data);
          localStorage.setItem('token', response.data.token);
      } else {
          console.error('Error:', response.data.message);
      }
  } catch (error) {
      console.error('Request failed:', error);
  }
  }
  const resendTime=5
  function gettoken() {
    if(theme){

      console.log(theme)
      console.log(theme.email)
    }
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);


    return () => clearInterval(timer);
  }, []);

    useEffect(() => {
      if (user_email) {
        setsignup(true)
        setEmail(user_email);
        console.log(user_email)
      }
    }, []);
  

  return (
    <>

    <div className="min-h-screen w-full">
      <HomeSideBar isOpen={isOpensidebar}/>
      <div className='hidden md:block'>
      <TopHeader/>
      </div>
   
      <div className="bg-white w-full shadow-sm">
        

        <NavBar/>
      <div className="w-full ">
    <div className="hidden xl:flex justify-center m-4 mx-10 ">

        {navbar.map((item) => (
          <div key={item} className='mx-auto px-2'>
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
  {slides.map((slide, index) => (
    <div key={index} className="relative w-full h-[500px] md:h-[700px] lg:h-[1400px] xl:h-[800px] p-2 transition-opacity duration-1000 overflow-hidden mx-2">
      <img src={slide.image} alt={slide.title} className="absolute inset-0 w-11/12 h-full lg:w-full object-cover rounded-xl lg:rounded-none mx-2 lg:m-0" />
    </div>
  ))}
</Carousel>


      </div>

      <div className='hidden mt-4 md:block'>
        <img src='718372747.webp' className='w-full' alt='show pic'/>
      </div>
      
      <div className='flex justify-center m-5 mt-10 md:hidden'>
      <img src="https://images.bewakoof.com/uploads/grid/app/msite-thinstrip-batman-launch-1718976543.jpg" className="w-full rounded-xl" alt="banner"/>
      </div>

      <h1 className='flex justify-center items-center font-semibold text-2xl md:text-3xl m-2'>
        Shop by Category-Men
      </h1>
      <div className="hidden md:grid grid-cols-6 gap-y-4">
        {imageData.map((image, index) => (
          <div key={index} className=''>
            <img src={image.image} width={400} height={300} layout="responsive"/>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <Carousel responsive={responsive_second}
        arrows={false}
        >
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
      <div className='hidden md:grid grid-cols-6 gap-y-4'>
        {[...mainImages, ...secondRowImages].map((image, index) => (
          <div key={index} className=''>
            <img src={image}  layout="responsive" className='w-full'/>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <Carousel responsive={responsive_second}
        arrows={false}
        >
          {[...mainImages, ...secondRowImages].map((src, index) => (
            <div key={index} className="flex justify-center mx-2">
              <img src={src} alt={`Image ${index + 1}`} className="w-full h-auto rounded" />
            </div>
          ))}
        </Carousel>
      </div>
      <h1 className='flex justify-center items-center font-semibold text-md md:text-3xl m-10'>
        EFFORTLESSLY STYLISH BESTSELLERS
      </h1>
      
      <Carousel 
       responsive={responsive_second}
       arrows={false}
       >

        {products.map((image, index) => (
          <div key={index} className='mx-3  border border-slate-200'>
            <div className="absolute  left-3 bg-[#525252CC] text-white px-1 py-1 text-xs font-extralight">
                  Oversized Fit
            </div>
            <img src={image.imgSrc} width={500} height={500} layout="responsive"/>
            <div className="mt-2 m-2">
              <h1 className='font-sans text-[#4F5362] text-sm'>
                Gezeno
              </h1>

            <h2 className="text-xs text-[#737373] font-light">
            Women&#39;s Blue Moody Jerry Graphic Printed Oversized T-shirt
                              </h2>
            <div className="flex items-center mb-5">
              <span className="text-sm font-extrabold">₹709</span>
              <span className="ml-2 text-gray-500 line-through text-sm ">₹1,419</span>
              <span className="ml-2 text-green-500 text-sm w-full">50% off</span>
            </div>
          </div>
          </div>
        ))}

      </Carousel>
        <h1 className='flex justify-center  text-3xl font-semibold m-10'>
          Gezeno Originals
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
       
        {bannerItems.map((images,index)=>(
          <div key={index} className='mx-3'>
            <img src={images.src} alt={images.href} className='w-full'/>
            </div>
        ))}
        </Carousel>

      <div className='hidden justify-center'>
       {widgetItems.map((images,index)=>(
            <div key={index} className='m-5 my-10'>
              <img src={images.src} width={150} height={50} alt={index}/>

            </div>
          ))}
          
          </div>
      <div className='m-5'>
      <Carousel responsive={responsive_eigth}
      arrows={false}
      >
      {widgetItems &&
        widgetItems.map((images, index) => (
          <div key={index} className='mx-2'>
            <img src={images.src} width={200} height={100} alt={index} />
          </div>
        ))}
    </Carousel>
      </div>
      
        <TooHotTobeMissed/>
        <BestPick/>
      
      <img src="https://images.bewakoof.com/uploads/grid/app/Desktop-Strip-3-1672040129.jpg" className='w-full mt-2' alt="banner-img"/>
      <img src="https://images.bewakoof.com/uploads/grid/app/Desktop-Strip-3-1669022420.jpg" className='w-full mt-10' alt="banner-img"/>
      
      </div>
     
     
        
      
        

        <div className='md:hidden'>
        <MobileFooterDropdown/>
        <MobileHomeFooter />

        </div>
       <Footer/>
     
    
    </>
  );
}