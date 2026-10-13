import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number // degrees
  perspective?: number
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  maxTilt = 8,
  perspective = 1000,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isDesktopAndMotionAllowed, setIsDesktopAndMotionAllowed] = useState(false)

  useEffect(() => {
    const checkCapabilities = () => {
      const isDesktop = window.innerWidth >= 1024
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setIsDesktopAndMotionAllowed(isDesktop && !prefersReduced)
    }

    checkCapabilities()
    window.addEventListener('resize', checkCapabilities)
    return () => window.removeEventListener('resize', checkCapabilities)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktopAndMotionAllowed || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left // x position within element
    const y = e.clientY - rect.top // y position within element

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Normalize (-1 to 1)
    const normalizedX = (x - centerX) / centerX
    const normalizedY = (y - centerY) / centerY

    // Invert Y for standard natural 3D tilt
    const rotateX = -normalizedY * maxTilt
    const rotateY = normalizedX * maxTilt

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseEnter = () => {
    if (isDesktopAndMotionAllowed) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  const transformStyle = isDesktopAndMotionAllowed
    ? {
        transform: `perspective(${perspective}px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        willChange: 'transform',
      }
    : undefined

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={cn('transition-shadow', className)}
      {...props}
    >
      {children}
    </div>
  )
}
