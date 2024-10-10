"use client";
import React, { useEffect, useState } from "react";
import { InputField } from "@/components/InputField";
import { useAppSelector } from "../lib/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../lib/hooks";
import { addEmail, addName, addNumber } from "../lib/store/features/mobilenumber/mobileSlice";
function Page() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [preNumber,setpreNumber]=useState("")
  const [password, setPassword] = useState("");
  const [gender,setGender]=useState("")
  const [response,setResponse]=useState("")
  const [credentials,setCredentials]=useState({})
  const mobilenumber=useAppSelector(state=>state.number)
  const dispatch=useAppDispatch()

  async function DispatchEmail (email) {
    dispatch(addEmail(email))
  }
  async function DispatchName(name){
    dispatch(addName(name))

  }

const router=useRouter()
  const handleClick=async()=> {
    setCredentials({
        name,number,email,gender
    })
    console.log(name);
    console.log(preNumber)
    const userData=await axios.post("http://localhost:8080/api/phone-number",{
        phone:preNumber,
        email:email,
        fullname:name,
        gender:gender
    }).then(async(res)=>{
        console.log(preNumber||number)
        console.log(res)
        
        await DispatchEmail(email).then(async()=>{
            // router.push('/verify')
            await DispatchName(name).then(()=>{
                router.push('/verify')
            })
        })
        // localStorage.setItem('user_credentials',JSON.stringify(credentials))
       



    })
  };
  const handleChange=(e)=>{
     setNumber(e.target.value)
  }
  useEffect(()=>{
    console.log(mobilenumber)
    console.log("this is mobile number",setpreNumber(mobilenumber.number))
  },[preNumber])
  return (
    <div className="flex justify-center items-center h-screen space-x-20  bg-gradient-to-b from-ultra-light-yellow to-yellow-100">
      {/* Left Image Section */}
      <div className="hidden md:flex items-center justify-center w-1/5 ">
        <img
          src="https://images.bewakoof.com/web/ik-signup-desktop-v2.jpg"
          alt="Signup Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center w-full md:w-1/3 h-screen ">
      <div className="flex flex-col bg-white ">
        <div className=" flex  flex-col m-10  p-10">
        <div className="text-3xl font-bold font-sans mb-10">
            Sign Up
        </div>
            <div className=" text-xl font-bold  font-sans  text-center whitespace-nowrap mb-10">
            Hi new buddy, let&#39;s get you started with the bewakoofi!
          </div>
          <InputField label="Name" onChange={(e) => setName(e.target.value)} />
          <InputField
            label="Mobile"
            onChange={handleChange}
          />
          <InputField
            label="Email Id"
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
          label="Gender"
          type="text"
          onChange={(e)=>setGender(e.target.value)}
          />
           

      </div>
      <div className="flex justify-center">
      <button
            onClick={handleClick}
            className="text-xl m-5 md:text-2xl border border-none bg-gray-300 text-gray-700 font-sans font-semibold rounded-lg w-2/3 px-5 py-3 mt-6"
          >
            PROCEED
          </button>

      </div>
      
            
        </div>
       
      
         
          {/* <div className="flex flex-col justify-center items-center w-2/3 md:w-3/4 h-[70vh] bg-white p-8 rounded-lg shadow-lg text-3xl md:text-4xl font-sans font-bold text-black mb-6">
            Sign Up
          </div>
          <div className="text-lg font-semibold text-gray-500 font-sans text-center mb-5">
            Hi new buddy, let's get you started with the bewakoofi!
          </div>
          <InputField label="Name" onChange={(e) => setName(e.target.value)} />
          <InputField
            label="Mobile"
            value="9599816677"
            onChange={(e) => setNumber(e.target.value)}
          />
          <InputField
            label="Email Id"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleClick}
            className="text-xl md:text-2xl border border-none bg-gray-300 text-gray-700 font-sans font-semibold rounded-lg w-full px-5 py-3 mt-6"
          >
            PROCEED
          </button> */}

      </div>
    </div>
  );
}

export default Page;
