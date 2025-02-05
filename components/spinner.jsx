import { Loader2 } from 'lucide-react'

export function Spinner({ className }) {
  return <Loader2 className={`h-10 w-10 animate-spin ${className}`} />
}

