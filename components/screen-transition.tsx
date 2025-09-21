"use client"

import type { ReactNode } from "react"

interface ScreenTransitionProps {
  children: ReactNode
  isActive: boolean
  direction?: "left" | "right" | "up" | "down"
}

export function ScreenTransition({ children, isActive, direction = "right" }: ScreenTransitionProps) {
  const getTransformClass = () => {
    if (!isActive) {
      switch (direction) {
        case "left":
          return "translate-x-full"
        case "right":
          return "-translate-x-full"
        case "up":
          return "translate-y-full"
        case "down":
          return "-translate-y-full"
        default:
          return "-translate-x-full"
      }
    }
    return "translate-x-0 translate-y-0"
  }

  return (
    <div
      className={`
      transition-all duration-500 ease-in-out transform
      ${getTransformClass()}
      ${isActive ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"}
    `}
    >
      {children}
    </div>
  )
}
