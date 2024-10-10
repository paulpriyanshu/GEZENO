import React from 'react'



export function Card({ className, children }) {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div className={`px-6 py-4 border-b ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}
// export const CardDescription = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLParagraphElement>
// >(({ className, ...props }, ref) => (
//   <p
//     ref={ref}
//     className={`text-sm text-muted-foreground ${className}`}
//     {...props}
//   />
// ))
// export const CardFooter = ({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={`flex items-center p-6 pt-0 ${className}`}
//     {...props}
//   />
// )