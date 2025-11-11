"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled = false, ...props }, ref) => {
    const handleToggle = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        ref={ref}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-white/20 transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "glass-base bg-accent-green/30 shadow-glass-float"
            : "glass-base bg-white/5 shadow-glass-float",
          className
        )}
        {...props}
      >
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-colors duration-300 ease-in-out",
            checked
              ? "glass-base glass-inner-shadow bg-accent-green translate-x-6"
              : "glass-base glass-inner-shadow bg-white/80 translate-x-1"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

