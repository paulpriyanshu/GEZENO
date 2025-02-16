"use client"

import { Plus, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/Input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import Cookie from "js-cookie"
import { toast } from "react-hot-toast"

const formSchema = z.object({
  street: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  country: z.string().min(1, "Country is required"),
})

export default function AddressForm() {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState(null)
  const user_email = Cookie.get('cred')

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  })

  // Fetch address on component mount
  useEffect(() => {
    fetchAddress()
  }, [])

  async function fetchAddress() {
    try {
      const response = await axios.post("https://backend.gezeno.in/api/get-address", { user_email })
      
      if (response.data.address) {
        setAddress(response.data.address)  // ✅ Store address for display
        form.reset(response.data.address)  // ✅ Populate form
      }
    } catch (error) {
      console.error("Error fetching address:", error)
    }
  }

  async function onSubmit(values) {
    values.user_email = user_email

    try {
      await axios.post("https://backend.gezeno.in/api/edit-address", { values })

      toast.success("Address saved successfully!")
      setOpen(false)  // ✅ Close the modal
      setAddress(values) // ✅ Update displayed address
      form.reset()    // ✅ Reset form after successful submission
    } catch (error) {
      toast.error("Failed to save address. Please try again.")
      console.error("Error submitting address:", error)
    }
  }

  return (
    <div className="flex justify-center items-center">
      {/* If address exists, show it in a card */}
      {address ? (
        <Card className="w-full md:w-1/3 p-4 border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Saved Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Street:</strong> {address.street}</p>
            <p><strong>City:</strong> {address.city}</p>
            <p><strong>State:</strong> {address.state}</p>
            <p><strong>Pincode:</strong> {address.pincode}</p>
            <p><strong>Country:</strong> {address.country}</p>
            <Button 
              variant="outline" 
              className="mt-4 flex items-center gap-2" 
              onClick={() => setOpen(true)}
            >
              <Edit className="w-4 h-4" /> Edit Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Show "Add New Address" button if no address exists
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-[200px] w-full md:w-1/3 border-dashed border-2 hover:border-blue-500 flex flex-col gap-2"
            >
              <Plus className="h-8 w-8 text-blue-500" />
              <span className="text-blue-500 font-medium text-lg">ADD NEW ADDRESS</span>
            </Button>
          </DialogTrigger>
        </Dialog>
      )}

      {/* Address Form Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="street" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="pincode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your pincode" maxLength={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                Save Address
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}