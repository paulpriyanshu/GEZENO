"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-hot-toast"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const formatCategories = (categories) => {
  const formatted = []

  categories.forEach((category) => {
    formatted.push({
      value: category._id,
      label: category.name,
    })

    if (category.subCategories?.length > 0) {
      category.subCategories.forEach((sub) => {
        formatted.push({
          value: sub._id,
          label: `${category.name} > ${sub.name}`,
        })

        if (sub.subSubCategories?.length > 0) {
          sub.subSubCategories.forEach((subsub) => {
            formatted.push({
              value: subsub._id,
              label: `${category.name} > ${sub.name} > ${subsub.name}`,
            })
          })
        }
      })
    }
  })

  return formatted
}

const formatProducts = (products) => {
  return products.map((product) => ({
    value: product._id,
    label: `${product.name} (₹${product.price})`,
  }))
}

const formSchema = z.object({
  code: z.string().min(3).max(20),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(0),
  minOrderValue: z.coerce.number().min(0),
  startDate: z.date(),
  endDate: z.date(),
  maxUses: z.coerce.number().min(0).nullable(),
  isActive: z.boolean(),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
})

export default function CouponForm({ coupon, onSuccess }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: coupon
      ? {
          ...coupon,
          startDate: new Date(coupon.startDate),
          endDate: new Date(coupon.endDate),
          applicableCategories: coupon.applicableCategories || [],
          applicableProducts: coupon.applicableProducts || [],
        }
      : {
          code: "",
          discountType: "percentage",
          discountValue: 0,
          minOrderValue: 0,
          startDate: new Date(),
          endDate: new Date(),
          maxUses: null,
          isActive: true,
          applicableCategories: [],
          applicableProducts: [],
        },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("https://backend.gezeno.in/api/products/getCategories"),
          fetch("https://backend.gezeno.in/api/products/getProducts"),
        ])

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const categoriesData = await categoriesRes.json()
        const productsData = await productsRes.json()

        const formattedCategories = formatCategories(categoriesData)
        const formattedProducts = formatProducts(productsData)

        setCategories(formattedCategories)
        setProducts(formattedProducts)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error fetching data")
      }
    }

    fetchData()
  }, [])

  async function onSubmit(values) {
    try {
      const url = coupon
        ? `https://backend.gezeno.in/api/updateCoupon/${coupon._id}`
        : "https://backend.gezeno.in/api/createCoupon"

      const response = await fetch(url, {
        method: coupon ? "POST" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(coupon ? "Coupon updated successfully" : "Coupon created successfully")
        onSuccess()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong")
    }
  }

  const handleAddCategory = (value) => {
    if (!value || form.getValues("applicableCategories").includes(value)) return

    const newCategories = [...form.getValues("applicableCategories"), value]
    form.setValue("applicableCategories", newCategories)
    setSelectedCategory("")
  }

  const handleRemoveCategory = (value) => {
    const newCategories = form.getValues("applicableCategories").filter((cat) => cat !== value)
    form.setValue("applicableCategories", newCategories)
  }

  const handleAddProduct = (value) => {
    if (!value || form.getValues("applicableProducts").includes(value)) return

    const newProducts = [...form.getValues("applicableProducts"), value]
    form.setValue("applicableProducts", newProducts)
    setSelectedProduct("")
  }

  const handleRemoveProduct = (value) => {
    const newProducts = form.getValues("applicableProducts").filter((prod) => prod !== value)
    form.setValue("applicableProducts", newProducts)
  }

  return (
    <div className="h-[600px] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MMMM d, yyyy"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MMMM d, yyyy"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        wrapperClassName="w-full"
                        minDate={form.watch("startDate")}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="minOrderValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Order Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number.parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxUses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Uses (0 for unlimited)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="applicableCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicable Categories</FormLabel>
                  <FormControl>
                    <Select value={selectedCategory} onValueChange={handleAddCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                            disabled={field.value.includes(category.value)}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((categoryId) => {
                      const category = categories.find((c) => c.value === categoryId)
                      return (
                        <div
                          key={categoryId}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {category?.label}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(categoryId)}
                            className="hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicableProducts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicable Products</FormLabel>
                  <FormControl>
                    <Select value={selectedProduct} onValueChange={handleAddProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.value}
                            value={product.value}
                            disabled={field.value.includes(product.value)}
                          >
                            {product.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((productId) => {
                      const product = products.find((p) => p.value === productId)
                      return (
                        <div
                          key={productId}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {product?.label}
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(productId)}
                            className="hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full sticky bottom-0 mt-6">
            {coupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

