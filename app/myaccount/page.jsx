import { cookies } from "next/headers"
import NavBar from "@/components/NavBar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Package,
  CreditCard,
  MapPin,
  User,
  HelpCircle,
} from "lucide-react"

import Modal from "@/components/modal"
import GotoSignup from "./GotoSignup"


export default async function ProfilePage() {

  const credCookie = cookies().get("cred")
  const nameCookie = cookies().get("name")

  const userCredentials = credCookie
    ? { email: credCookie.value, name: decodeURIComponent(nameCookie?.value || "") }
    : null

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="grid md:grid-cols-3 gap-6">
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
                <Button className="w-full mt-6 bg-[#F8CE46] hover:bg-[#e5bd3d] text-black">
                  EDIT PROFILE
                </Button>
              </Card>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "My Orders", description: "View, Modify And Track Orders", icon: Package },
                { title: "My Payments", description: "View And Modify Payment Methods", icon: CreditCard },
                { title: "My Addresses", description: "Edit, Add Or Remove Addresses", icon: MapPin },
                { title: "My Profile", description: "Edit Personal Info And Change Password", icon: User },
                { title: "Help & Support", description: "Reach Out To Us", icon: HelpCircle },
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

      {/* Modal for unauthenticated users */}
      {!userCredentials && (
        <Modal isOpen={true} onClose={() => {}}>
          <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Sign Up Required</h2>
            <p className="text-gray-600">
              You need to sign up to access this page. Please create an account to proceed.
            </p>
            
            {/* GotoSignup component (you could pass necessary props here, if needed) */}
            <GotoSignup />

            {/* Close button */}
            <div
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
              aria-label="Close Modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}