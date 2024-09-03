"use client"
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@/components/modal'
import axios from 'axios'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
function page() {
const email=useSelector(state=>state.number.email)
const name=useSelector(state=>state.number.name)
const [otp,setOtp]=useState("")
const router=useRouter()
const handleOtpClick=async()=>{
    try {
      console.log("this email has been set",email)
      const response = await axios.post('http://localhost:8080/api/verify-otp', {
          email,
          otp
      });

      // Handle the response as needed
      if (response.data.success) {
          console.log('Logged in successfully:', response.data);
          // You can store the token in local storage or use it directly for further requests
          localStorage.setItem('token', response.data.token);
          const token=response.data.token
          Cookies.set('authToken', token, {
            expires: 7,
            secure: true,
            sameSite: 'Strict',
            path: '/'
          });
          Cookies.set('cred',email)
          Cookies.set('name',name)
          

          console.log('Login successful');
          router.push('/')
          // Redirect user or show success message
      } else {
          console.error('Error:', response.data.message);
          // Show an error message to the user
      }
  } catch (error) {
      console.error('Request failed:', error);
      // Handle errors, like network issues, etc.
  }
  }
  const resendTime=5
if(!email) return(
    <div>
        Please signup again
    </div>
)
    
  return (
    <div>
          
       { email && <Modal isOpen={true}>
       <div>
       <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Verify with OTP</h2>
          <button className="text-gray-500">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Sent to {email} </p>

          <input
            type="text"
            // value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter OTP"
          />
          <p className="text-sm text-gray-500 mb-4">
            RESEND OTP in 00:{resendTime.toString().padStart(2, '0')}s
          </p>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
            onClick={handleOtpClick}
          >
            SUBMIT OTP
          </button>

      </div>
         
       </div>
    </Modal>
 
    }
    
    </div>
  )
}

export default page