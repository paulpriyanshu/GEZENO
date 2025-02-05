import Link from "next/link"
import { Search } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="font-bold text-xl">
          Bewakoof
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/men" className="transition-colors hover:text-foreground/80">
            MEN
          </Link>
          <Link href="/women" className="transition-colors hover:text-foreground/80">
            WOMEN
          </Link>
          <Link href="/mobile-covers" className="transition-colors hover:text-foreground/80">
            MOBILE COVERS
          </Link>
        </nav>
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by products" className="pl-8" />
          </div>
        </div>
        <Button variant="ghost">LOGIN</Button>
      </div>
    </header>
  )
}

