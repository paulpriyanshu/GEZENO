"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CouponForm  from "./coupon-form"
import { DeleteDialog } from "./delete-dailog"



export default function Page() {
  const [coupons, setCoupons] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/getAllCoupons")
      const data = await response.json()
      if (data.success) {
        setCoupons(data.data)
      }
    } catch (error) {
      toast.error("Failed to fetch coupons")
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/deleteCoupon/${id}`, {
        method: "POST",
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Coupon deleted successfully")
        fetchCoupons()
      }
    } catch (error) {
      toast.error("Failed to delete coupon")
    }
    setDeleteId(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <CouponForm
              onSuccess={() => {
                setIsCreateOpen(false)
                fetchCoupons()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon._id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(coupon.startDate), "PP")} -
                      <br />
                      {format(new Date(coupon.endDate), "PP")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.currentUses} / {coupon.maxUses || "∞"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {coupon.isActive ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Coupon</DialogTitle>
                          </DialogHeader>
                          <CouponForm
                            coupon={coupon}
                            onSuccess={() => {
                              setEditingCoupon(null)
                              fetchCoupons()
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(coupon._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  )
}

