import React from 'react'
import { useApp } from '@/context/AppContext'
import type { Role } from '@/types'
import { useTranslation } from 'react-i18next'
import { User, Wrench, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const rolesList: { id: Role; labelKey: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'resident', labelKey: 'roles.resident', icon: User },
  { id: 'staff', labelKey: 'roles.staff', icon: Wrench },
  { id: 'admin', labelKey: 'roles.admin', icon: Shield },
]

export const RoleSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { role, setRole } = useApp()
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'inline-flex items-center p-0.5 rounded-control bg-background border border-border select-none',
        className
      )}
    >
      {rolesList.map((item) => {
        const Icon = item.icon
        const isActive = role === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setRole(item.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-[6px] transition-all cursor-pointer',
              isActive
                ? 'bg-card text-primary font-semibold shadow-subtle border border-border/60'
                : 'text-text-muted hover:text-text'
            )}
          >
            <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-primary' : 'text-text-muted')} />
            <span>{t(item.labelKey)}</span>
          </button>
        )
      })}
    </div>
  )
}
