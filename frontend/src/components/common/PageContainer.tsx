import React from 'react'
import { cn } from '@/lib/utils'

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide'
}

export function PageContainer({
  children,
  className,
  size = 'default',
  ...props
}: PageContainerProps) {
  const maxClass =
    size === 'narrow' ? 'max-w-3xl' : size === 'wide' ? 'max-w-[1360px]' : 'max-w-[1200px]'

  return (
    <div
      className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all', maxClass, className)}
      {...props}
    >
      {children}
    </div>
  )
}
