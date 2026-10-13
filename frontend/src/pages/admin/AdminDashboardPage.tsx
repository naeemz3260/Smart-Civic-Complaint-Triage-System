import React from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { getCityStats, getReviewQueue, getTickets } from '@/lib/api'
import {
  ShieldAlert,
  Sliders,
  BarChart3,
  Settings,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['cityStats'],
    queryFn: getCityStats,
  })

  const { data: reviewQueue } = useQuery({
    queryKey: ['reviewQueue'],
    queryFn: getReviewQueue,
  })

  const { data: tickets } = useQuery({
    queryKey: ['adminTickets'],
    queryFn: () => getTickets({ limit: 5 }),
  })

  return (
    <PageContainer className="py-8 space-y-6">
      {/* Header with admin shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Municipal Command Center</span>
          </div>
          <h1 className="text-2xl font-bold text-text">Admin HQ Dashboard</h1>
          <p className="text-sm text-text-muted">
            City-wide triage oversight, low-confidence reviews, and dispatch calibration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/what-if">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Sliders className="w-4 h-4 text-primary" />
              <span>What-If Sandbox</span>
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button variant="outline" size="sm" className="gap-1.5">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs text-text-muted">Total Intake</span>
          <p className="text-2xl font-bold text-text tabular-nums mt-1">
            {stats?.total_complaints.toLocaleString() ?? '12,480'}
          </p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-text-muted">Resolved</span>
          <p className="text-2xl font-bold text-status-resolved tabular-nums mt-1">
            {stats?.resolved_count.toLocaleString() ?? '8,932'}
          </p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-text-muted">In Progress</span>
          <p className="text-2xl font-bold text-status-inprogress tabular-nums mt-1">
            {stats?.pending_count.toLocaleString() ?? '3,121'}
          </p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-text-muted">At-Risk / Breached</span>
          <p className="text-2xl font-bold text-status-onhold tabular-nums mt-1">
            {stats?.breached_count.toLocaleString() ?? '427'}
          </p>
        </Card>
      </div>

      {/* Low-Confidence Human Review Queue */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-priority-high" />
              <span>Low-Confidence Review Queue ({reviewQueue?.length ?? 0})</span>
            </CardTitle>
            <span className="text-xs text-text-muted">Confidence 50% - 75%</span>
          </div>
          <CardDescription>
            AI engine flagged these ambiguous complaints for human supervisor category confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(reviewQueue || []).map((item) => (
              <div
                key={item.review_id}
                className="p-3.5 rounded-control border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-text">{item.title}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-priority-high-soft text-priority-high font-mono">
                      {Math.round(item.confidence * 100)}% conf
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{item.reason}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="secondary" size="sm">
                    Confirm {item.predicted_category}
                  </Button>
                  <Button variant="outline" size="sm">
                    Reclassify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
