import { Button } from "@/components/ui/button";

export default function CheckoutFooter() {
  return (
    <div className="w-full bg-white p-4 shadow-sm rounded-lg fixed bottom-0 left-0 md:bottom-4 md:left-4 md:w-auto z-50">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-2xl font-bold">₹948</span>
        </div>
        <Button className="bg-[#7FE7E5] hover:bg-[#6CD9D7] text-black font-semibold py-3 px-6 rounded-md text-lg w-full md:w-auto">
          Proceed
        </Button>
      </div>
    </div>
  );
}
