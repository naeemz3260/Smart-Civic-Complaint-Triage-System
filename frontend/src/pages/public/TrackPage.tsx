import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { CivicImage } from '@/components/ui/CivicImage'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { getTicketByTrackingCode } from '@/lib/api'
import type { Ticket } from '@/types'
import { formatDate } from '@/lib/utils'
import { Search, MapPin, Calendar, Clock, CheckCircle2, User, Building2 } from 'lucide-react'

export const TrackPage: React.FC = () => {
  const { trackingCode } = useParams<{ trackingCode?: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [inputCode, setInputCode] = useState(trackingCode || '')
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const result = await getTicketByTrackingCode(codeToSearch)
      setTicket(result)
      if (trackingCode !== codeToSearch) {
        navigate(`/track/${codeToSearch}`, { replace: true })
      }
    } catch {
      setTicket(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (trackingCode) {
      setInputCode(trackingCode)
      handleSearch(trackingCode)
    }
  }, [trackingCode])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(inputCode)
  }

  return (
    <PageContainer size="narrow" className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Track Complaint</h1>
        <p className="text-sm text-text-muted">
          Look up the real-time status and audit timeline of any reported civic issue.
        </p>
      </div>

      {/* Lookup Bar */}
      <form onSubmit={onSubmit} className="flex gap-2 mb-6">
        <Input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter tracking code (e.g. CC-2026-901230)"
          className="font-mono uppercase"
        />
        <Button type="submit" variant="primary" className="gap-2 shrink-0">
          <Search className="w-4 h-4" />
          <span>Lookup</span>
        </Button>
      </form>

      {/* Quick Test Chips */}
      <div className="flex items-center gap-2 mb-8 text-xs text-text-muted">
        <span>Try sample codes:</span>
        <button
          type="button"
          onClick={() => {
            setInputCode('CC-2026-901230')
            handleSearch('CC-2026-901230')
          }}
          className="font-mono text-primary hover:underline bg-primary-soft px-2 py-0.5 rounded"
        >
          CC-2026-901230
        </button>
        <button
          type="button"
          onClick={() => {
            setInputCode('CC-2026-901233')
            handleSearch('CC-2026-901233')
          }}
          className="font-mono text-primary hover:underline bg-primary-soft px-2 py-0.5 rounded"
        >
          CC-2026-901233
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </Card>
      ) : ticket ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge level={ticket.priority_level} />
                </div>
                <span className="font-mono text-xs text-text-muted font-bold">
                  {ticket.tracking_code}
                </span>
              </div>
              <CardTitle className="text-xl pt-2">{ticket.title}</CardTitle>
              <CardDescription>{ticket.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-background rounded-control border border-border text-xs">
                <div>
                  <span className="text-text-muted block">Department</span>
                  <span className="font-medium text-text">{ticket.department}</span>
                </div>
                <div>
                  <span className="text-text-muted block">Ward</span>
                  <span className="font-medium text-text">{ticket.ward_id}</span>
                </div>
                <div>
                  <span className="text-text-muted block">Reported</span>
                  <span className="font-medium text-text">
                    {formatDate(ticket.created_at, i18n.language)}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block">SLA Target</span>
                  <span className="font-medium text-text">
                    {formatDate(ticket.sla_due_at, i18n.language)}
                  </span>
                </div>
              </div>

              {ticket.photo_url && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-text block mb-2">Photo Evidence</span>
                  <CivicImage
                    src={ticket.photo_url}
                    aspectRatio="16/9"
                    className="max-h-64 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Audit Log */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Status & Audit History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative ps-6 border-s border-border space-y-6 my-2">
                {(ticket.status_events || []).map((event) => (
                  <div key={event.id} className="relative">
                    <span className="absolute -start-[31px] top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-card" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-xs font-semibold text-text">
                        Status: {event.to_status}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {formatDate(event.timestamp, i18n.language)}
                      </span>
                    </div>
                    {event.comment && (
                      <p className="text-xs text-text-muted mt-1">{event.comment}</p>
                    )}
                    <span className="text-[10px] text-text-muted/80 block mt-0.5">
                      Actor: {event.actor_name || event.actor_role}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : searched ? (
        <EmptyState
          title="No Complaint Found"
          description={`We couldn't find a complaint matching tracking code "${inputCode}". Verify the code and try again.`}
          actionLabel="Clear Search"
          onAction={() => {
            setInputCode('')
            setSearched(false)
          }}
        />
      ) : null}
    </PageContainer>
  )
}
