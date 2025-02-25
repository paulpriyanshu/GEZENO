"use client"

import { useState } from "react"
import { InputField } from "@/components/InputField"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { useAppDispatch } from "../lib/hooks"
import { addEmail, addName } from "../lib/store/features/mobilenumber/mobileSlice"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const dispatch=useAppDispatch()
   async function DispatchEmail(email) {
      dispatch(addEmail(email))
    }
    async function DispatchName(name) {
      dispatch(addName(name))
    }
  
  const handleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post("https://backend.gezeno.in/api/users/login-with-email", { email })

      if (response.data.message === "OTP sent. Please verify your OTP.") {
        // Store the userId in localStorage or in a state management solution
        console.log("user response",response?.data)
        localStorage.setItem("userId", response?.data?.userId)
        await DispatchEmail(email)
        await DispatchName(response?.data?.user?.fullName)
        // Redirect to the verify page
        router.push("/verify")
      } else {
        setError("Unexpected response from server")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred")
        console.log(error)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-b from-ultra-light-yellow to-yellow-100 p-4 md:p-0">
      {/* Left Image Section */}
      <div className="hidden md:flex items-center justify-center w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
        <img src="/signup.png" alt="Login Image" className="w-full h-auto object-cover rounded-lg shadow-md" />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-2/3 lg:w-1/3 bg-white rounded-lg shadow-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold font-sans mb-6 text-center md:text-left">Login</h1>
        <p className="text-lg md:text-xl font-semibold text-gray-600 font-sans text-center mb-8">
          Welcome back, buddy! Let&apos;s get you logged in.
        </p>
        <InputField label="Email Id" type="email" onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full text-xl md:text-2xl border border-none bg-gray-300 text-gray-700 font-sans font-semibold rounded-lg px-5 py-3 mt-6 hover:bg-gray-400 transition-colors duration-300 disabled:opacity-50"
        >
          {isLoading ? "SENDING OTP..." : "LOGIN"}
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don&apos;t have an account?</span>
          <Link href="/signup" className="ml-2 text-blue-500 hover:text-blue-600 font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

