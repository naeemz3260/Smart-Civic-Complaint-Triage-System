import React from 'react'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { getCityStats } from '@/lib/api'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'

const CATEGORY_COLORS = ['#1E8E6E', '#E8731A', '#2F7DD1', '#B88A0B', '#2E9E6B', '#D64545']

export const AdminAnalyticsPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['cityStats'],
    queryFn: getCityStats,
  })

  const categoryData = Object.entries(stats?.category_distribution || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  return (
    <PageContainer className="py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-1.5">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Operational Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-text">City Analytics & Trends</h1>
        <p className="text-sm text-text-muted">
          Aggregate category breakdown, resolution throughput, and SLA compliance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Donut */}
        <Card className="lg:col-span-6 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Complaints by Category</CardTitle>
            <CardDescription>Volume distribution across municipal infrastructure types</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E3EAE7',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operational Highlights */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base">Resolution Performance Highlights</CardTitle>
            <CardDescription>SLA efficiency and average response milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-control bg-background border border-border flex items-center justify-between">
              <div>
                <span className="font-semibold text-text block">Average Resolution Time</span>
                <span className="text-text-muted">From submission to verified after-photo</span>
              </div>
              <span className="text-lg font-bold font-mono text-primary">3.4 days</span>
            </div>

            <div className="p-4 rounded-control bg-background border border-border flex items-center justify-between">
              <div>
                <span className="font-semibold text-text block">Auto-Triage Direct Dispatch</span>
                <span className="text-text-muted">Complaints routed without human queue</span>
              </div>
              <span className="text-lg font-bold font-mono text-primary">86.7%</span>
            </div>

            <div className="p-4 rounded-control bg-background border border-border flex items-center justify-between">
              <div>
                <span className="font-semibold text-text block">Geospatial Cluster Deduplication</span>
                <span className="text-text-muted">Complaints merged within 60m threshold</span>
              </div>
              <span className="text-lg font-bold font-mono text-primary">14.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
