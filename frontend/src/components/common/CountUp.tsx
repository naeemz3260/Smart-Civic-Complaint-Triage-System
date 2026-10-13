import React, { useEffect, useState, useRef } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  decimals?: number
  className?: string
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 1600,
  suffix = '',
  decimals = 0,
  className,
}) => {
  const [value, setValue] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true
          const startTime = performance.now()

          const updateCounter = (currentTime: number) => {
            const elapsedTime = currentTime - startTime
            const progress = Math.min(elapsedTime / duration, 1)

            // Ease-out cubic formula
            const easeOutProgress = 1 - Math.pow(1 - progress, 3)
            const currentVal = easeOutProgress * end

            setValue(currentVal)

            if (progress < 1) {
              requestAnimationFrame(updateCounter)
            } else {
              setValue(end)
            }
          };

          requestAnimationFrame(updateCounter)
        }
      },
      { threshold: 0.2 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={elementRef} className={className}>
      {decimals > 0
        ? value.toFixed(decimals)
        : Math.floor(value).toLocaleString()}
      {suffix}
    </span>
  )
}
