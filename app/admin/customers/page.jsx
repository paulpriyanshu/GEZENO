"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, ArrowUpDown } from "lucide-react"

// Sample data
const customers = [
  {
    id: 1,
    name: "Aarav Patel",
    products: [
      { name: "Spice Grinder", price: 1200, category: "Kitchen" },
      { name: "Silk Saree", price: 5000, category: "Clothing" },
    ],
  },
  {
    id: 2,
    name: "Diya Sharma",
    products: [
      { name: "Pressure Cooker", price: 2500, category: "Kitchen" },
      { name: "Kurta Set", price: 3000, category: "Clothing" },
      { name: "Yoga Mat", price: 800, category: "Fitness" },
    ],
  },
  {
    id: 3,
    name: "Vihaan Singh",
    products: [
      { name: "Cricket Bat", price: 1500, category: "Sports" },
      { name: "Tandoor Oven", price: 8000, category: "Kitchen" },
    ],
  },
  {
    id: 4,
    name: "Ananya Reddy",
    products: [
      { name: "Henna Kit", price: 500, category: "Beauty" },
      { name: "Ghungroo Bells", price: 1000, category: "Music" },
      { name: "Sari Blouse", price: 1200, category: "Clothing" },
    ],
  },
  {
    id: 5,
    name: "Arjun Gupta",
    products: [
      { name: "Tabla Set", price: 6000, category: "Music" },
      { name: "Dhoti Kurta", price: 2500, category: "Clothing" },
    ],
  },
]

const categories = ["Kitchen", "Clothing", "Fitness", "Sports", "Beauty", "Music"]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, Infinity])
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handlePriceRangeChange = (value) => {
    switch (value) {
      case "0-1000":
        setPriceRange([0, 1000])
        break
      case "1001-5000":
        setPriceRange([1001, 5000])
        break
      case "5001+":
        setPriceRange([5001, Infinity])
        break
      default:
        setPriceRange([0, Infinity])
    }
  }

  const filteredAndSortedCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategories.length === 0 || customer.products.some(product => 
          selectedCategories.includes(product.category)
        )
        const matchesPrice = customer.products.some(product => 
          product.price >= priceRange[0] && product.price <= priceRange[1]
        )
        return matchesSearch && matchesCategory && matchesPrice
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else if (sortBy === "totalSpent") {
          const totalA = a.products.reduce((sum, product) => sum + product.price, 0)
          const totalB = b.products.reduce((sum, product) => sum + product.price, 0)
          return sortOrder === "asc" ? totalA - totalB : totalB - totalA
        } else if (sortBy === "productCount") {
          return sortOrder === "asc" ? a.products.length - b.products.length : b.products.length - a.products.length
        }
        return 0
      })
  }, [searchTerm, selectedCategories, priceRange, sortBy, sortOrder])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customer List</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 h-fit">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price Range</Label>
              <Select onValueChange={handlePriceRangeChange}>
                <option value="all">All Prices</option>
                <option value="0-1000">₹0 - ₹1000</option>
                <option value="1001-5000">₹1001 - ₹5000</option>
                <option value="5001+">₹5001+</option>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
         
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button variant="ghost" onClick={() => handleSort("name")} className="font-bold">
                      Customer Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" onClick={() => handleSort("totalSpent")} className="font-bold">
                      Total Spent
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button variant="ghost" onClick={() => handleSort("productCount")} className="font-bold">
                      Product Count
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {customer.products.map((product, index) => (
                          <li key={index} className="mb-1">
                            {product.name} - ₹{product.price}
                            <Badge variant="secondary" className="ml-2">
                              {product.category}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{customer.products.reduce((sum, product) => sum + product.price, 0)}
                    </TableCell>
                    <TableCell className="text-center">{customer.products.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}