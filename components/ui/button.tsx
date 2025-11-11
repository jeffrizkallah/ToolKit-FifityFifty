import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#0041A8] to-[#007BFF] text-white font-semibold hover:from-[#003d96] hover:to-[#0069e6] hover:shadow-lg hover:scale-105",
        secondary: "bg-accent-orange/20 text-accent-orange hover:bg-accent-orange/30 hover:brightness-110",
        destructive:
          "bg-error/20 text-error hover:bg-error/30 hover:brightness-110",
        outline:
          "border border-white/20 bg-white/2 hover:bg-white/5 backdrop-blur-md hover:border-white/30",
        ghost: "bg-white/1 hover:bg-white/5 backdrop-blur-sm",
        link: "text-brand-primary underline-offset-4 hover:underline bg-transparent shadow-none",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-full",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-10 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

