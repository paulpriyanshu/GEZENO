"use client"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function Error() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load terms and conditions. Please try again later.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={() => window.location.reload()} 
        variant="outline" 
        className="mt-4"
      >
        Retry
      </Button>
    </div>
  )
}

