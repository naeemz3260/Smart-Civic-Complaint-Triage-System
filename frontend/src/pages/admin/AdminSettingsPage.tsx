import React from 'react'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MOCK_CATEGORIES } from '@/mock/mockData'
import { Settings, Save, Check } from 'lucide-react'

export const AdminSettingsPage: React.FC = () => {
  return (
    <PageContainer className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-1.5">
            <Settings className="w-3.5 h-3.5" />
            <span>System Preferences</span>
          </div>
          <h1 className="text-2xl font-bold text-text">Municipal Settings & SLAs</h1>
          <p className="text-sm text-text-muted">
            Configure urban category definitions, department assignments, and default resolution SLA targets.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-1.5 self-start">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registered Urban Issue Categories</CardTitle>
          <CardDescription>
            SLA deadlines define the escalation triggers when work orders are unaddressed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="p-3 text-start font-semibold">Category Name</th>
                  <th className="p-3 text-start font-semibold">Department</th>
                  <th className="p-3 text-start font-semibold">Base Severity</th>
                  <th className="p-3 text-start font-semibold">Default SLA</th>
                  <th className="p-3 text-end font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {MOCK_CATEGORIES.map((cat) => (
                  <tr key={cat.id} className="hover:bg-background/50">
                    <td className="p-3 font-medium text-text">{cat.name}</td>
                    <td className="p-3 text-text-muted">{cat.department}</td>
                    <td className="p-3 font-mono">{(cat.base_severity * 100).toFixed(0)}%</td>
                    <td className="p-3 font-mono">{cat.default_sla_hours} hours</td>
                    <td className="p-3 text-end">
                      <span className="inline-flex items-center gap-1 text-primary font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
