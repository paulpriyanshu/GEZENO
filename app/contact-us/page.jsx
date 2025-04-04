"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"
import { toast } from "react-hot-toast"
import { Toaster } from "react-hot-toast"
import NavBar from "@/components/NavBar"



// Main ContactPage component
export default function ContactPage() {
  const [contactData, setContactData] = useState(null)
  const [navBarData, setNavBarData] = useState([])
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    // Fetch contact data
    fetch("https://backend.gezeno.in/api/products/terms-and-conditions")
      .then((res) => res.json())
      .then((data) => setContactData(data.contactus))
      .catch((error) => console.error("Error fetching contact data:", error))

    // Fetch navbar data
    fetch("https://backend.gezeno.in/api/home/headers")
      .then((res) => res.json())
      .then((data) => setNavBarData(data))
      .catch((error) => console.error("Error fetching navbar data:", error))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await fetch("https://backend.gezeno.in/api/users/contact-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Message sent successfully!")
        setFormData({ name: "", email: "", message: "" }) // Reset form
      } else {
        toast.error("Failed to send message. Try again.")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setIsSending(false)
    }
  }


  if(!contactData){
    return (
      <div class="flex justify-center items-center h-screen">
      <div class="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
    </div>
    )
  }
  


  return (
    <div className="min-h-screen bg-background">
      <NavBar data={navBarData} />

      <main className="container mx-auto px-4 py-12">
        <Toaster/>
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="text-muted-foreground mb-8" dangerouslySetInnerHTML={{ __html: contactData }}></p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full"
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
              <Textarea
                name="message"
                placeholder="Message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full min-h-[150px]"
              />
              <Button type="submit" className="w-full bg-[#4AB8B2] hover:bg-[#3a9691]" disabled={isSending}>
                {isSending ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
          <div className="bg-[#4AB8B2] p-8 text-white">
            <h2 className="text-2xl font-semibold mb-8">Contact Info</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-5 h-5 mt-1" />
                <div>
                  <p className="font-medium">+91 9711911391</p>
                  <p className="text-sm opacity-90">(Available Monday to Saturday)</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 mt-1" />
                <div>
                  <p className="font-medium">support@gezeno.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 mt-1" />
                <div>
                  <p className="font-medium">Gezeno</p>
                  <p className="text-sm opacity-90">G40 Shyam Park, Nawada</p>
                  <p className="text-sm opacity-90">Uttam Nagar, Delhi, 110059</p>
                </div>
              </div>
            </div>
            <div className="mt-12 flex space-x-4">
              <a href="#" className="hover:opacity-80">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-80">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-80">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

