import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | '21/9' | 'auto'
  fallbackText?: string
  containerClassName?: string
}

const aspectRatioClasses = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/2': 'aspect-[3/2]',
  '21/9': 'aspect-[21/9]',
  auto: '',
}

export const Img: React.FC<ImgProps> = ({
  src,
  alt,
  aspectRatio = 'auto',
  fallbackText,
  className,
  containerClassName,
  ...props
}) => {
  const { t } = useTranslation()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const resolvedAlt = alt || t('image.alt', { defaultValue: 'CivicCare photograph' })
  const resolvedFallbackText = fallbackText || t('image.failed', { defaultValue: 'Image unavailable' })
  const ratioClass = aspectRatioClasses[aspectRatio] || ''

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-background/80 flex items-center justify-center select-none',
        ratioClass,
        containerClassName
      )}
    >
      {/* Subtle skeleton pulse while loading */}
      {isLoading && !hasError && src && (
        <div className="absolute inset-0 animate-pulse bg-border/50 z-10" />
      )}

      {/* Neutral error fallback */}
      {(!src || hasError) ? (
        <div className="flex flex-col items-center justify-center p-4 text-center text-text-muted bg-background w-full h-full min-h-[140px]">
          <ImageOff className="w-7 h-7 mb-1.5 opacity-40 text-text-muted" strokeWidth={1.5} />
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
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          {...props}
        />
      )}
    </div>
  )
}

export default Img
