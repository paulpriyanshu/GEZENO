import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Plus, Filter } from 'lucide-react'
// import img from 'next/image'

const productStats = [
  { label: 'Products by sell-through rate', value: '0%', subValue: '↑ 100%' },
  { label: 'Products by days of inventory remaining', value: 'No data' },
  { label: 'ABC product analysis', value: 'No data' },
]

const products = [
  { id: 1, name: 'Classic White T-Shirt', status: 'Active', inventory: '50 in stock', salesChannels: 2, markets: 3, category: 'Apparel', type: 'T-Shirt', vendor: 'Fashion Co.' },
  { id: 2, name: 'Slim Fit Jeans', status: 'Active', inventory: '30 in stock', salesChannels: 2, markets: 2, category: 'Apparel', type: 'Jeans', vendor: 'Denim Masters' },
  { id: 3, name: 'Floral Summer Dress', status: 'Active', inventory: '20 in stock', salesChannels: 2, markets: 2, category: 'Dresses', type: 'Summer Dress', vendor: 'Chic Boutique' },
  { id: 4, name: 'Leather Jacket', status: 'Draft', inventory: '15 in stock', salesChannels: 1, markets: 1, category: 'Outerwear', type: 'Jacket', vendor: 'Leather Luxe' },
  { id: 5, name: 'Running Shoes', status: 'Active', inventory: '40 in stock', salesChannels: 3, markets: 4, category: 'Footwear', type: 'Athletic Shoes', vendor: 'SportyStep' },
  { id: 6, name: 'Silk Scarf', status: 'Active', inventory: '25 in stock', salesChannels: 2, markets: 3, category: 'Accessories', type: 'Scarf', vendor: 'Luxe Accessories' },
  { id: 7, name: 'Wool Sweater', status: 'Active', inventory: '35 in stock', salesChannels: 2, markets: 2, category: 'Apparel', type: 'Sweater', vendor: 'Cozy Knits' },
  { id: 8, name: 'Leather Wallet', status: 'Active', inventory: '60 in stock', salesChannels: 3, markets: 3, category: 'Accessories', type: 'Wallet', vendor: 'Leather Luxe' },
  { id: 9, name: 'Sunglasses', status: 'Active', inventory: '45 in stock', salesChannels: 2, markets: 4, category: 'Accessories', type: 'Eyewear', vendor: 'Sunny Shades' },
  { id: 10, name: 'Yoga Mat', status: 'Active', inventory: '30 in stock', salesChannels: 2, markets: 2, category: 'Fitness', type: 'Exercise Equipment', vendor: 'Zen Fitness' },
]

export default function ProductsPage() {
  return (
    <div className='flex h-screen bg-slate-100'>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="sm:hidden">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex">Export</Button>
          <Button variant="outline" className="hidden sm:inline-flex">Import</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">More actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Bulk edit</DropdownMenuItem>
              <DropdownMenuItem>Print product labels</DropdownMenuItem>
              <DropdownMenuItem className="sm:hidden">Export</DropdownMenuItem>
              <DropdownMenuItem className="sm:hidden">Import</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add product
          </Button>
        </div>
      </div>

      {/* Product statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {productStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subValue && <p className="text-xs text-muted-foreground">{stat.subValue}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product filters and search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline">All</Button>
          <Button variant="outline">Active</Button>
          <Button variant="outline">Draft</Button>
          <Button variant="outline">Archived</Button>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="text" placeholder="Search products" className="pl-8 w-full" />
        </div>
      </div>

      {/* Products table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"><Checkbox /></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead className="hidden md:table-cell">Sales channels</TableHead>
                <TableHead className="hidden lg:table-cell">Markets</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden xl:table-cell">Type</TableHead>
                <TableHead className="hidden xl:table-cell">Vendor</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=40&width=40&text=${product.id}`}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="truncate max-w-[150px] sm:max-w-none">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>{product.inventory}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.salesChannels}</TableCell>
                  <TableCell className="hidden lg:table-cell">{product.markets}</TableCell>
                  <TableCell className="hidden sm:table-cell">{product.category}</TableCell>
                  <TableCell className="hidden xl:table-cell">{product.type}</TableCell>
                  <TableCell className="hidden xl:table-cell">{product.vendor}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
    </div>
  )
}