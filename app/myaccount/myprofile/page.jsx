"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import debounce from "lodash/debounce"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/Input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string(),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Invalid mobile number"),
  dob: z.date(),
  gender: z.enum(["male", "female", "other"]),
  whatsappUpdates: z.boolean().default(false),
})

// Simulated server action - replace with your actual database call
async function updateUserProfile(values) {
  try {
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
    if (!response.ok) throw new Error("Failed to update profile")
    return await response.json()
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export default function UserProfile() {
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form with mock user data
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "Priyanshu",
      lastName: "",
      email: "priyanshu.paul003@gmail.com",
      mobile: "+918448157940",
      dob: new Date("2024-08-13"),
      gender: "male",
      whatsappUpdates: false,
    },
  })

  // Debounced save function
  const debouncedSave = debounce(async (values) => {
    setIsSaving(true)
    try {
      await updateUserProfile(values)
    } finally {
      setIsSaving(false)
    }
  }, 1000)

  // Watch form changes and auto-save
  useEffect(() => {
    const subscription = form.watch((value) => {
      debouncedSave(value)
    })
    return () => subscription.unsubscribe()
  }, [form.watch, debouncedSave]) // Added debouncedSave to dependencies

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Form {...form}>
        <form className="space-y-6">
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
                  <Button variant="outline" className="text-blue-600">
                    CHANGE
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DOB</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => field.onChange(e.target.valueAsDate)}
                  />
                </FormControl>
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

      <p className="text-sm text-gray-500 mt-4">
        Share your DOB to get special gifts on the 1st day of your birthday month
      </p>
    </div>
  )
}

