"use client"
import NavBar from '@/components/NavBar';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch } from '../lib/hooks';
import { addNumber } from '../lib/store/features/mobilenumber/mobileSlice';

function Page() {
    const router=useRouter()
    const [mobileNumber,SetMobileNumber]=useState("")
    const dispatch=useAppDispatch()
    async function Dispatch (mobileNumber) {
        dispatch(addNumber(mobileNumber))
    }
    const handleSubmit=async()=>{
        console.log("passed the api")
        const number=await axios.post("http://localhost:8080/api/login-with-phone",{
            phone:mobileNumber,
            
            

        }).then(async(res)=>{
            console.log("umber has been sent")
            console.log(res)
             if(res.data.exist===false){
            await  Dispatch(mobileNumber).then(()=>{
                router.push('/signup')
            })
           
        }

        })
       
       

    }
  return (
    <>
    <NavBar/>
     <div className='flex justify-center items-center h-screen'>
        
        <div className='border-none h-screen w-full justify-center items-center hidden md:block'>
            <div className='bg-gradient-to-b from-ultra-light-yellow to-yellow-100 w-full h-screen flex flex-col justify-center items-center'>
             <h1 className='text-4xl m-2 font-sans font-bold'>Welcome to the world of Gezeno®!</h1>
                <img src='loginpageimage.webp' className='max-w-full max-h-full'/>  
            </div>
        </div>
        <div className='flex justify-center w-full'>
            <div className='flex flex-col justify-center items-center w-full'>
                <div className='text-4xl font-sans font-bold text-black m-3'>
                    Log in / Signup 
                </div>
                <div className='text-lg font-semibold text-gray-500 font-sans mx-5 mb-5 hidden md:block'>
                    for Latest trends, exciting offers and everything Gezeno®!
                </div>
                <input className='text-xl border border-gray-500 text-gray-800 font-bold rounded-lg w-2/3 px-5 py-4 mt-10' placeholder='Enter Mobile Number' onChange={(e)=>SetMobileNumber(e.target.value)}/>
                <button onClick={handleSubmit} className='text-2xl border border-none bg-teal-500 text-white font-sans font-semibold rounded-lg w-2/3 px-5 py-3 m-3'>
                    CONTINUE
                </button>
                <div className="flex items-center justify-center w-2/3 my-5">
                    <div className="flex-grow border-t-2 border-gray-500"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t-2 border-gray-500"></div>
                </div>
                <button  className='flex jusitfy-center items-center text-xl border border-gray-500 text-gray-500 font-bold font-sans rounded-lg w-1/4 px-2 py-2 mt-2'>
                    <img src='google.png' width={20} className='ml-5'/>
                   <h1 className='mx-3'>GOOGLE</h1>
                </button>
                
            </div>
        </div>
    </div>
    </>
   
  )
}

export default Page;
