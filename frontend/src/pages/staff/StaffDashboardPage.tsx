import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useQuery } from '@tanstack/react-query'
import { getTickets } from '@/lib/api'
import type { PriorityLevel } from '@/types'
import { Wrench, Filter, Search, ArrowRight, Clock, MapPin } from 'lucide-react'

export const StaffDashboardPage: React.FC = () => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['staffTickets', priorityFilter],
    queryFn: () => getTickets(),
  })

  const filteredTickets = (tickets || []).filter((t) => {
    if (priorityFilter !== 'all' && t.priority_level !== priorityFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        t.title.toLowerCase().includes(q) ||
        t.tracking_code.toLowerCase().includes(q) ||
        t.ward_id.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <PageContainer className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-1.5">
            <Wrench className="w-3.5 h-3.5" />
            <span>Field Operations Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-text">My Assigned Tasks</h1>
          <p className="text-sm text-text-muted">
            Work orders dispatched to your municipal unit requiring on-site resolution.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-control transition-colors capitalize ${
                priorityFilter === p
                  ? 'bg-primary text-white shadow-subtle'
                  : 'bg-card border border-border text-text-muted hover:text-text'
              }`}
            >
              {p === 'all' ? 'All Priorities' : `${p} Priority`}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="p-4 hover:shadow-card transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">
                    {ticket.tracking_code}
                  </span>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge level={ticket.priority_level} />
                </div>
                <h3 className="text-sm font-semibold text-text">{ticket.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {ticket.ward_id}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    SLA: {new Date(ticket.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {ticket.assigned_to && (
                    <span className="text-primary font-medium">{ticket.assigned_to}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/staff/tickets/${ticket.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <span>Manage Work Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
