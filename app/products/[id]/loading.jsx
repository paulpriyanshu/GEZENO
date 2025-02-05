'use client'

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="relative">
        <motion.img
          src="/logo.webp"
          alt="Gezeno Logo"
          className="w-48 h-auto"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 3,
            ease: "easeInOut"
          }}
        />
      </div>
      <motion.div 
        className="w-48 h-1 mt-8 bg-gray-100 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-[#4FD1C5] rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  )
}