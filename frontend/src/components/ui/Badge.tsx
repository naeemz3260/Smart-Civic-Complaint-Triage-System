import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { Status, PriorityLevel } from '@/types'
import { useTranslation } from 'react-i18next'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors select-none tabular-nums',
  {
    variants: {
      variant: {
        primary: 'bg-primary-soft text-primary',
        secondary: 'bg-background text-text-muted border border-border',
        // Priorities
        priorityHigh: 'bg-priority-high-soft text-priority-high border border-[#F9D8B6]',
        priorityMedium: 'bg-priority-medium-soft text-priority-medium border border-[#F3E2AE]',
        priorityLow: 'bg-priority-low-soft text-priority-low border border-[#C6EBDA]',
        // Statuses
        statusInProgress: 'bg-status-inprogress-soft text-status-inprogress border border-[#C6DDF6]',
        statusResolved: 'bg-status-resolved-soft text-status-resolved border border-[#C6EBDA]',
        statusOnHold: 'bg-status-onhold-soft text-status-onhold border border-[#F6C6C6]',
        statusSubmitted: 'bg-background text-text border border-border',
        statusReview: 'bg-priority-high-soft text-priority-high border border-[#F9D8B6]',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export function StatusBadge({ status, className }: { status: Status | string; className?: string }) {
  const { t } = useTranslation()

  let variant: VariantProps<typeof badgeVariants>['variant'] = 'secondary'
  if (status === 'IN_PROGRESS' || status === 'ASSIGNED' || status === 'TRIAGED') {
    variant = 'statusInProgress'
  } else if (status === 'RESOLVED' || status === 'CLOSED') {
    variant = 'statusResolved'
  } else if (status === 'REJECTED' || status === 'ON_HOLD') {
    variant = 'statusOnHold'
  } else if (status === 'NEEDS_REVIEW') {
    variant = 'statusReview'
  } else if (status === 'SUBMITTED') {
    variant = 'statusSubmitted'
  }

  const label = t(`status.${status}`, { defaultValue: status })

  return (
    <Badge variant={variant} className={className}>
      <span className="inline-block w-1.5 h-1.5 rounded-full me-1.5 bg-current opacity-80" />
      {label}
    </Badge>
  )
}

export function PriorityBadge({ level, className }: { level: PriorityLevel | string; className?: string }) {
  const { t } = useTranslation()

  let variant: VariantProps<typeof badgeVariants>['variant'] = 'priorityLow'
  if (level === 'high') {
    variant = 'priorityHigh'
  } else if (level === 'medium') {
    variant = 'priorityMedium'
  } else if (level === 'low') {
    variant = 'priorityLow'
  }

  const label = t(`priority.${level}`, { defaultValue: `${level.toUpperCase()} Priority` })

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
