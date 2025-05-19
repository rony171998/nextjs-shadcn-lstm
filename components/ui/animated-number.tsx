"use client"

import { useEffect, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatValue?: (value: number) => string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 500,
  formatValue = (val) => val.toFixed(2),
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let startTime: number | null = null
    const startValue = displayValue
    const endValue = value
    const change = endValue - startValue

    if (change === 0) return

    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t)
      const easedProgress = easeOutQuad(progress)

      setDisplayValue(startValue + change * easedProgress)

      if (progress < 1) {
        window.requestAnimationFrame(animateValue)
      }
    }

    window.requestAnimationFrame(animateValue)
  }, [value, duration])

  return <span className={className}>{formatValue(displayValue)}</span>
}
