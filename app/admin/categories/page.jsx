'use client'

import * as React from "react"
import { CaretSortIcon, ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { Plus, Pencil, Trash2 } from "lucide-react"
import axios from 'axios'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import toast, { Toaster } from 'react-hot-toast'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,

} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function SubCategoryList({ subCategories }) {
  return (
    <div className="space-y-2">
      {subCategories.map((subCategory) => (
        <div key={subCategory._id} className="flex items-center space-x-2">
          <span>{subCategory.name}</span>
        </div>
      ))}
    </div>
  )
}

function EditCategoryModal({ category, onSave, onClose }) {
  const [editedCategory, setEditedCategory] = React.useState(category)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)

  const handleInputChange = (e) => {
    const { name, value, type } = e.target  
    setEditedCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }))
  }

  const handleSwitchChange = (name) => (checked) => {
    setEditedCategory(prev => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`)
      const { url, filename } = response.data

      await axios.put(url, file, {
        headers: { 
          'Content-Type': file.type || 'image/jpeg',
          'Content-Length': file.size
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      })

      const imageUrlResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`)
      const imageUrl = imageUrlResponse.data.url

      setEditedCategory(prev => ({
        ...prev,
        image: imageUrl
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`https://backend.gezeno.in/api/editcategory/${editedCategory._id}`, editedCategory)
      if (response.data.success) {
        onSave(response.data.data)
        toast.success("Category has been updated successfully.")
        onClose()
      } else {
        console.error('Error updating category:', response.data.message)
        toast.error("Failed to update category. Please try again.")
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <DialogContent className="sm:max-w-[725px] max-h-[100vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Category</DialogTitle>
      </DialogHeader>
      <div className="px-4 py-2">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={editedCategory.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {editedCategory.image && (
                <div className="mt-2">
                  <img
                    src={editedCategory.image}
                    alt="Category"
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={editedCategory.description || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={editedCategory.isActive}
              onCheckedChange={handleSwitchChange('isActive')}
            />
            <Label htmlFor="isActive">Active Status</Label>
          </div>

          {isUploading && (
            <div>
              <progress value={uploadProgress} max="100" className="w-full" />
              <p className="text-center">{Math.round(uploadProgress)}% Uploaded</p>
            </div>
          )}

          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Save changes'}
          </Button>
        </form>
      </div>
    </DialogContent>
  )
}

function CreateCategoryModal({ onSave, onClose }) {
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
  })
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setNewCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }))
  }

  const handleSwitchChange = (name) => (checked) => {
    setNewCategory(prev => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const response = await axios.get(`https://backend.gezeno.in/api/imageUpload/${file.name}`)
      const { url, filename } = response.data

      await axios.put(url, file, {
        headers: { 
          'Content-Type': file.type || 'image/jpeg',
          'Content-Length': file.size
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      })

      const imageUrlResponse = await axios.get(`https://backend.gezeno.in/api/image/${filename}`)
      const imageUrl = imageUrlResponse.data.url

      setNewCategory(prev => ({
        ...prev,
        image: imageUrl
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://backend.gezeno.in/api/createCategory', newCategory)

        onSave(response.data.category)
        toast.success("Category has been added successfully.")
        onClose()
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <DialogContent className="sm:max-w-[725px] max-h-[100vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Category</DialogTitle>
      </DialogHeader>
      <div className="px-4 py-2">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {newCategory.image && (
                <div className="mt-2">
                  <img
                    src={newCategory.image}
                    alt="Category"
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={newCategory.isActive}
              onCheckedChange={handleSwitchChange('isActive')}
            />
            <Label htmlFor="isActive">Active Status</Label>
          </div>

          {isUploading && (
            <div>
              <progress value={uploadProgress} max="100" className="w-full" />
              <p className="text-center">{Math.round(uploadProgress)}% Uploaded</p>
            </div>
          )}

          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Create Category'}
          </Button>
        </form>
      </div>
    </DialogContent>
  )
}

export default function CategoryPage() {
  const [categories, setCategories] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pageSize, setPageSize] = React.useState(10)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  React.useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://backend.gezeno.in/api/getCategories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error("Failed to fetch categories. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.post(`https://backend.gezeno.in/api/deletecategory/${categoryId}`)
      if (response.data.success) {
        setCategories(prevCategories => prevCategories.filter(category => category._id !== categoryId))
        toast.success("Category deleted successfully.")
      } else {
        console.error('Error deleting category:', response.data.message)
        toast.error("Failed to delete category. Please try again.")
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const columns = [
    {
      accessorKey: "_id",
      header: "SR NO",
      cell: ({ row }) => <div className="w-[80px]">{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CATEGORY NAME
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.image && (
            <img
              src={row.original.image}
              alt={row.getValue("name")}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DESCRIPTION
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const description = row.getValue("description")
        const truncatedDescription = description.length > 100 
          ? description.substring(0, 100) + "..." 
          : description

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[200px] truncate">{truncatedDescription}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs whitespace-normal">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "STATUS",
      cell: ({ row }) => (
        <div className={`inline-block px-3 py-1 rounded-full text-xs ${
          row.getValue("isActive") 
            ? "bg-green-100 text-green-500" 
            : "bg-red-100 text-red-500"
        }`}>
          {row.getValue("isActive") ? "ACTIVE" : "INACTIVE"}
        </div>
      ),
    },
    {
      id: "subCategories",
      header: "SUB CATEGORIES",
      cell: ({ row }) => {
        const category = row.original
        return (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <span className="sr-only">Toggle sub categories</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {category.subCategories && category.subCategories.length > 0 ? (
                <SubCategoryList subCategories={category.subCategories} />
              ) : (
                <p>No sub categories</p>
              )}
            </CollapsibleContent>
          </Collapsible>
        )
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <EditCategoryModal 
              category={row.original} 
              onSave={async (updatedCategory) => {
                await fetchCategories()
              }}
              onClose={() => {}}
            />
          </Dialog>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this category?')) {
                deleteCategory(row.original._id)
              }
            }}
          >
            <span className="sr-only">Delete</span>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: categories,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleCreateCategory = async (newCategory) => {
    await fetchCategories()
    setIsCreateModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Show</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(parseInt(value))
              table.setPageSize(parseInt(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">entries</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={(table.getColumn("name")?.getFilterValue() ?? "")}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Record
              </Button>
            </DialogTrigger>
            <CreateCategoryModal 
              onSave={handleCreateCategory}
              onClose={() => setIsCreateModalOpen(false)}
            />
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows?.length ?? 0} of{" "}
          {table.getFilteredRowModel().rows?.length ?? 0} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}