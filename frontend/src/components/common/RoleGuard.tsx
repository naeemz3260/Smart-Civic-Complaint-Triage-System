import React from 'react'
import { useApp } from '@/context/AppContext'
import type { Role } from '@/types'
import { useTranslation } from 'react-i18next'
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { PageContainer } from '@/components/common/PageContainer'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { role, setRole } = useApp()
  const { t } = useTranslation()

  if (allowedRoles.includes(role)) {
    return <>{children}</>
  }

  const primaryAllowed = allowedRoles[0]
  const roleName = t(`roles.${primaryAllowed}`, { defaultValue: primaryAllowed })

  return (
    <PageContainer size="narrow" className="py-12">
      <Card className="border-priority-high/40 bg-card shadow-card">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-priority-high-soft text-priority-high flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <CardTitle className="text-xl">
            {t('common.unauthorizedTitle', { defaultValue: 'Role Access Restricted' })}
          </CardTitle>
          <CardDescription className="pt-2">
            {t('common.unauthorizedDesc', {
              role: roleName,
              defaultValue: `This view requires ${roleName} permissions. Use the persona switcher to simulate this role.`,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => setRole(primaryAllowed)}
              className="gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Switch Persona to {roleName}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {t('common.back', { defaultValue: 'Go Back' })}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
