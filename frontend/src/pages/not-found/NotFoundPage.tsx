import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileQuestion, Home } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PageContainer size="narrow" className="py-16">
      <Card className="text-center p-8 max-w-md mx-auto shadow-card">
        <div className="w-16 h-16 rounded-full bg-status-onhold-soft text-status-onhold flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <CardHeader className="p-0 mb-4">
          <span className="font-mono text-sm font-bold text-primary block mb-1">404</span>
          <CardTitle className="text-xl">
            {t('common.notFoundTitle', { defaultValue: 'Page Not Found' })}
          </CardTitle>
          <CardDescription className="pt-2">
            {t('common.notFoundDesc', {
              defaultValue: 'The civic portal page you requested does not exist or has been moved.',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
