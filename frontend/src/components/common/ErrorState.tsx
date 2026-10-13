import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title, message, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-card border border-status-onhold/30 bg-status-onhold-soft/30 my-4',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-status-onhold-soft text-status-onhold flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-text mb-1">
        {title || t('common.errorGenericTitle', { defaultValue: 'Something went wrong' })}
      </h4>
      <p className="text-sm text-text-muted max-w-md mb-5">
        {message || t('common.errorGenericDesc', { defaultValue: 'Could not load information. Please try again.' })}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="w-4 h-4 me-2" />
          {t('common.retry', { defaultValue: 'Try Again' })}
        </Button>
      )}
    </div>
  )
}
