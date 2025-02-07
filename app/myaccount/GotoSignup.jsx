"use client"
import React from 'react'
import { Button } from '@/components/ui/button'

function GotoSignup() {
  return ( 
  <Button onClick={() => (window.location.href = "/signup")} className="w-full">
  Go to Sign Up
</Button>
  )
}

export default GotoSignup