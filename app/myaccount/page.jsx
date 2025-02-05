"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/NavBar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Package,
  CreditCard,
  Wallet,
  MapPin,
  User,
  LogOut,
  Truck,
  Clock,
  Gift,
  HelpCircle,
  BookOpen,
  LineChart,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { Modal } from "./modal"
import Cookies from "js-cookie"

// interface UserCredentials {
//   email: string
//   name: string
// }

export default function ProfilePage() {
  const [navBarData, setNavBarData] = useState([])
  const [userCredentials, setUserCredentials] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeConfigResponse = await axios.get("https://backend.gezeno.in/api/home/headers")
        setNavBarData(homeConfigResponse.data)

        const credCookie = Cookies.get("cred")
        const nameCookie = Cookies.get("name")
        console.log("cred",credCookie)
        if (credCookie) {
          const email = credCookie
          const name = decodeURIComponent(nameCookie)
          console.log(email,name)
          setUserCredentials({ email, name })
        } else {
          setIsModalOpen(true)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    Cookies.remove("cred")
    setUserCredentials(null)
    router.push("/login") // Redirect to login page
  }

  const handleSignUpRedirect = () => {
    setIsModalOpen(false)
    router.push("/signup")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <NavBar data={navBarData} />
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Sidebar Toggle Button */}
        <Button onClick={toggleSidebar} className="lg:hidden fixed top-4 left-4 z-50" variant="outline" size="icon">
          <Menu className="h-6 w-6" />
        </Button>

        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white p-6 space-y-6 shadow-lg transition-transform duration-300 ease-in-out transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
        >
          <Button onClick={toggleSidebar} className="lg:hidden absolute top-4 right-4" variant="outline" size="icon">
            <X className="h-6 w-6" />
          </Button>
          <nav className="space-y-2 mt-12 lg:mt-0">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-600 rounded-lg bg-blue-50"
            >
              <Package className="w-5 h-5" />
              Overview
            </Link>
            {[
              ["My Orders", Package],
              ["My Payments", CreditCard],
              ["My Wallet", Wallet],
              ["My Addresses", MapPin],
              ["My Profile", User],
            ].map(([label, Icon]) => (
              <Link
                key={label}
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-gray-100 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* User Info */}
              <Card className="md:col-span-2 p-6 bg-[#FEF9F0]">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#F8CE46] flex items-center justify-center text-2xl font-semibold">
                    {userCredentials?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">{userCredentials?.name}</h2>
                    <p className="text-gray-600 text-sm mb-1">{userCredentials?.email}</p>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-[#F8CE46] hover:bg-[#e5bd3d] text-black">EDIT PROFILE</Button>
              </Card>

              {/* Premium Card */}
              <Card className="p-6 bg-[#FEF6E9]">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Gezeno TriBe</h3>
                  <p className="text-sm text-gray-600 mb-6">Upgrade to the premium experience now</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Truck className="w-6 h-6 mx-auto mb-2 text-[#F8CE46]" />
                      <p className="text-xs">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-[#F8CE46]" />
                      <p className="text-xs">Early Access</p>
                    </div>
                    <div className="text-center">
                      <Gift className="w-6 h-6 mx-auto mb-2 text-[#F8CE46]" />
                      <p className="text-xs">VIP Support</p>
                    </div>
                  </div>
                  <Button className="w-full bg-[#F8CE46] hover:bg-[#e5bd3d] text-black">GET TRIBE MEMBERSHIP</Button>
                </div>
              </Card>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "My Orders",
                  description: "View, Modify And Track Orders",
                  icon: Package,
                },
                {
                  title: "My Payments",
                  description: "View And Modify Payment Methods",
                  icon: CreditCard,
                },
                {
                  title: "My Wallet",
                  description: "Bewakoof Wallet History And Redeemed Gift Cards",
                  icon: Wallet,
                },
                {
                  title: "My Addresses",
                  description: "Edit, Add Or Remove Addresses",
                  icon: MapPin,
                },
                {
                  title: "My Profile",
                  description: "Edit Personal Info And Change Password",
                  icon: User,
                },
                {
                  title: "Help & Support",
                  description: "Reach Out To Us",
                  icon: HelpCircle,
                },
                {
                  title: "Our Story",
                  description: "Our Story",
                  icon: LineChart,
                },
                {
                  title: "Fanbook",
                  description: "Fanbook",
                  icon: BookOpen,
                },
              ].map((item, index) => (
                <Card key={index} className="p-6">
                  <div className="text-center">
                    <item.icon className="w-8 h-8 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Sign Up Required</h2>
          <p className="mb-4">You need to sign up to access this page.</p>
          <Button onClick={handleSignUpRedirect} className="w-full">
            Go to Sign Up
          </Button>
        </div>
      </Modal>
    </>
  )
}

