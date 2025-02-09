"use client"
import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../lib/hooks'
import Modal from '@/components/modal'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

function Page() {
  const email = useAppSelector(state => state.number.email)
  const name = useAppSelector(state => state.number.name)
  const [otp, setOtp] = useState("")
  const [resendTime, setResendTime] = useState(120) // Increased to 2 minutes (120s)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendTime > 0) {
      const timer = setTimeout(() => setResendTime(resendTime - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setIsResendDisabled(false)
    }
  }, [resendTime])

  const handleOtpClick = async () => {
    setLoading(true) // Show loading state
    try {
      console.log("this email has been set", email)
      const response = await axios.post('https://backend.gezeno.in/api/verify-otp', { email, otp })

      if (response.data.success) {
        console.log('Logged in successfully:', response.data)
        const token = response.data.token
        localStorage.setItem('token', token)
        Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'Strict', path: '/' })
        Cookies.set('cred', email)
        Cookies.set('name', name)
        toast.success('Login successful')
        router.push('/')
      } else {
        toast.error(response.data.message || 'Invalid OTP')
      }
    } catch (error) {
      console.error('Request failed:', error)
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false) // Hide loading state after request
  }

  const handleResendOtp = async () => {
    try {
      setIsResendDisabled(true)
      setResendTime(120) // Reset countdown to 2 minutes
      await axios.post('https://backend.gezeno.in/api/resend-otp', { email })
      toast.success('OTP resent successfully!')
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.')
      setIsResendDisabled(false)
    }
  }

  if (!email) return (
    <div className='flex justify-center items-center h-screen text-2xl font-bold'>
      Please signup again
    </div>
  )

  return (
    <div>
      {email && (
        <Modal isOpen={true}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Verify with OTP</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Sent to {email}</p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter OTP"
            />

            <p className="text-sm text-gray-500 mb-4">
              RESEND OTP in 00:{resendTime.toString().padStart(2, '0')}s
            </p>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 flex justify-center items-center"
              onClick={handleOtpClick}
              disabled={loading} // Disable button when loading
            >
              {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span> : null}
              {loading ? "Submitting..." : "SUBMIT OTP"}
            </button>

            <button
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className={`mt-4 w-full py-2 rounded ${isResendDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
            >
              RESEND OTP
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Page