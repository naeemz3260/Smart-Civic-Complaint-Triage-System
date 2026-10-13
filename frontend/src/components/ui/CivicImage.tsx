import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CivicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | 'video' | 'square'
  fallbackText?: string
  containerClassName?: string
}

const aspectRatioClasses = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/2': 'aspect-[3/2]',
  video: 'aspect-video',
  square: 'aspect-square',
}

export function CivicImage({
  src,
  alt,
  aspectRatio = '16/9',
  fallbackText,
  className,
  containerClassName,
  ...props
}: CivicImageProps) {
  const { t } = useTranslation()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const resolvedAlt = alt || t('image.alt', { defaultValue: 'Civic issue photo' })
  const resolvedFallbackText = fallbackText || t('image.failed', { defaultValue: 'Image unavailable' })

  const ratioClass = aspectRatioClasses[aspectRatio] || 'aspect-[16/9]'

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-control bg-background border border-border flex items-center justify-center select-none',
        ratioClass,
        containerClassName
      )}
    >
      {/* Skeleton while loading */}
      {isLoading && !hasError && src && (
        <div className="absolute inset-0 animate-pulse bg-border/40" />
      )}

      {/* Neutral Error Fallback */}
      {(!src || hasError) ? (
        <div className="flex flex-col items-center justify-center p-4 text-center text-text-muted">
          <ImageOff className="w-8 h-8 mb-2 opacity-40 text-text-muted" strokeWidth={1.5} />
          <span className="text-xs font-medium">{resolvedFallbackText}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={resolvedAlt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-200',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          {...props}
        />
      )}
    </div>
  )
}
