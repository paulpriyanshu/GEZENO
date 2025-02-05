"use client"

import { useEffect, useState } from "react"
import { InputField } from "@/components/InputField"
import { useAppSelector, useAppDispatch } from "../lib/hooks"
import axios from "axios"
import { useRouter } from "next/navigation"
import { addEmail, addName } from "../lib/store/features/mobilenumber/mobileSlice"
import Link from "next/link"

function Page() {
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")
  const [credentials, setCredentials] = useState({})
  const mobilenumber = useAppSelector((state) => state.number)
  const dispatch = useAppDispatch()
  const router = useRouter()

  async function DispatchEmail(email) {
    dispatch(addEmail(email))
  }

  async function DispatchName(name) {
    dispatch(addName(name))
  }

  const handleClick = async () => {
    setCredentials({
      name,
      number,
      email,
      gender,
    })

    try {
      console.log("name",name)
      const res = await axios.post("https://backend.gezeno.in/api/phone-number", {
        phone: number || mobilenumber.number,
        email: email,
        fullName: name, 
        gender: gender,
      })

      console.log(res)

      await DispatchEmail(email)
      await DispatchName(name)

      localStorage.setItem("user_credentials", JSON.stringify(credentials))
      router.push("/verify")
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  useEffect(() => {
    console.log("Mobile number:", mobilenumber.number)
  }, [mobilenumber.number])

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-b from-ultra-light-yellow to-yellow-100 p-4 md:p-0">
      {/* Left Image Section */}
      <div className="hidden md:flex items-center justify-center w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
        <img src="/signup.png" alt="Signup Image" className="w-full h-auto object-cover rounded-lg shadow-md" />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-2/3 lg:w-1/3 bg-white rounded-lg shadow-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold font-sans mb-6 text-center md:text-left">Sign Up</h1>
        <p className="text-lg md:text-xl font-semibold text-gray-600 font-sans text-center mb-8">
          Hi new buddy, let&apos;s get you started with the bewakoofi!
        </p>
        <InputField label="Name" onChange={(e) => setName(e.target.value)} />
        <InputField label="Mobile" value={number} onChange={(e) => setNumber(e.target.value)} />
        <InputField label="Email Id" onChange={(e) => setEmail(e.target.value)} />
        <InputField label="Gender" type="text" onChange={(e) => setGender(e.target.value)} />
        <button
          onClick={handleClick}
          className="w-full text-xl md:text-2xl border border-none bg-gray-300 text-gray-700 font-sans font-semibold rounded-lg px-5 py-3 mt-6 hover:bg-gray-400 transition-colors duration-300"
        >
          PROCEED
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Link href="/login" className="ml-2 text-blue-500 hover:text-blue-600 font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page

