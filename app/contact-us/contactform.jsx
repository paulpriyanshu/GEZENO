"use client"

import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSending, setIsSending] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await fetch("/api/contact", {
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

  return (
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
  )
}

export default ContactForm

