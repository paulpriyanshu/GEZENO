"use client"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center transition-all duration-500 ease-in-out overflow-hidden">
      <div className="absolute inset-0 bg-gradient from-white to-gray-500 animate-gradient-shift" />
      <Card className="w-full max-w-xl bg-transparent shadow-none overflow-hidden border border-none">
        <CardContent className="p-0">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="relative">
              <motion.img
                src="/logo.webp"
                alt="Gezeno Logo"
                className="w-48 h-auto"
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            </div>
            <motion.div className="w-48 h-1 mt-8 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#4FD1C5] rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 0% 100%;
          }
        }
        .animate-gradient-shift {
          animation: gradientShift 20s ease infinite alternate;
          background-size: 100% 200%;
        }
      `}</style>
    </div>
  )
}

