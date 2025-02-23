"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast, Toaster } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/Input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from "axios"
import Cookie from "js-cookie"

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string(),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Invalid mobile number"),
  gender: z.enum(["male", "female", "other"]),
})

async function updateUserProfile(values) {
  const response = await axios.post("https://backend.gezeno.in/api/update-profile", {
      username: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email,
      phone: values.mobile,
      gender: values.gender,
    })

  if (!response) {
    throw new Error("Failed to update profile")
  }

  return response
}

async function fetchUserData(email) {
  // Replace this with your actual API call to fetch user data
  const response = await axios.post("https://backend.gezeno.in/api/get-user", {
    email
  })
  console.log("response", response.data)

  return response.data
}

export default function UserProfile() {
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      gender: "male",
    },
  })

  useEffect(() => {
    async function loadUserData() {
      const email = Cookie.get('cred')
      const data = await fetchUserData(email)
      setUserData(data)

      // Set form values after data is fetched
      form.reset({
        firstName: data.fullName.split(' ')[0] || "",
        lastName: data.fullName.split(' ')[1] || "",
        email: data.email || "",
        mobile: data.phone || "",
        gender: data.gender || "male",
      })
    }
    loadUserData()
  }, [form])

  async function onSubmit(values) {
    setIsSaving(true)
    toast
      .promise(
        updateUserProfile(values),
        {
          loading: "Updating profile...",
          success: "Profile updated successfully!",
          error: (err) => `Error: ${err.message}`,
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 5000,
            icon: "🎉",
          },
        },
      )
      .finally(() => setIsSaving(false))
  }

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Id *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number *</FormLabel>
                <div className="flex gap-4">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Gender</FormLabel>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <div className="flex-1">
                        <RadioGroupItem value="male" id="male" className="peer hidden" />
                        <label
                          htmlFor="male"
                          className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          Male
                        </label>
                      </div>
                      <div className="flex-1">
                        <RadioGroupItem value="female" id="female" className="peer hidden" />
                        <label
                          htmlFor="female"
                          className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          Female
                        </label>
                      </div>
                      <div className="flex-1">
                        <RadioGroupItem value="other" id="other" className="peer hidden" />
                        <label
                          htmlFor="other"
                          className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          Other
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "SAVE CHANGES"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
