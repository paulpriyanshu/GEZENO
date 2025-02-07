import { Plus, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentMethods() {
  return (
    <div className="w-full max-w-3xl p-4">
      <h1 className="text-2xl font-semibold mb-6">My Payments</h1>

      <Card className="border rounded-lg">
        <CardContent className="p-6 space-y-8">
          {/* Debit & Credit Cards Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800">Debit & Credit Cards</h2>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-md">
              <CreditCard className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600">No Debit/Credit Card saved</span>
            </div>
          </div>

          {/* UPI Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800">UPI</h2>
            <button className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src="/upi-icon.png"
                  alt="UPI Icon"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-gray-600">Add UPI ID</span>
              </div>
              <Plus className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

