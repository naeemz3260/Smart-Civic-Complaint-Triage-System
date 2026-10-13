import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { CivicImage } from '@/components/ui/CivicImage'
import { Textarea } from '@/components/ui/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTicketById, verifyClosure, updateTicketStatus } from '@/lib/api'
import { ArrowLeft, CheckCircle2, Camera, Clock, MapPin, AlertTriangle } from 'lucide-react'

export const StaffTicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [closureComment, setClosureComment] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketById(id || 't-1001'),
  })

  const resolveMutation = useMutation({
    mutationFn: async () => {
      if (!ticket) return
      setIsVerifying(true)
      await verifyClosure(ticket.id, 'pothole_after.jpg', closureComment || 'Repairs completed by field crew.')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['staffTickets'] })
      setIsVerifying(false)
    },
  })

  if (!ticket) {
    return (
      <PageContainer className="py-8">
        <p className="text-text-muted text-sm">Loading work order details...</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="py-8 space-y-6">
      <button
        type="button"
        onClick={() => navigate('/staff')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Assigned Tasks</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-sm font-bold text-primary">{ticket.tracking_code}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge level={ticket.priority_level} />
          </div>
          <h1 className="text-2xl font-bold text-text">{ticket.title}</h1>
        </div>

        {ticket.status !== 'RESOLVED' && (
          <Button
            variant="primary"
            onClick={() => resolveMutation.mutate()}
            isLoading={isVerifying}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Work Complete</span>
          </Button>
        )}
      </div>

      {/* Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Incident Evidence & Field Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text leading-relaxed">{ticket.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-semibold text-text block mb-1.5">
                    Before Condition (Citizen Report)
                  </span>
                  <CivicImage
                    src={ticket.photo_url || '/uploads/pothole_before.jpg'}
                    aspectRatio="4/3"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-text block mb-1.5">
                    After Repair Photo {ticket.after_photo_url ? '(Verified)' : '(Required for Closure)'}
                  </span>
                  {ticket.after_photo_url ? (
                    <CivicImage src={ticket.after_photo_url} aspectRatio="4/3" />
                  ) : (
                    <div className="border border-dashed border-border rounded-control aspect-[4/3] flex flex-col items-center justify-center p-4 text-center bg-background">
                      <Camera className="w-6 h-6 text-text-muted mb-2 opacity-50" />
                      <p className="text-xs font-medium text-text">Mandatory After Photo</p>
                      <p className="text-[10px] text-text-muted mt-1">
                        Upload completion photo to enable SLA resolution
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority breakdown sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Triage Factors</CardTitle>
              <CardDescription>AI scoring engine factor decomposition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted">Severity Factor</span>
                  <span className="font-mono font-medium">{Math.round(ticket.severity_factor * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-priority-high rounded-full"
                    style={{ width: `${ticket.severity_factor * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted">Impact Factor</span>
                  <span className="font-mono font-medium">{Math.round(ticket.impact_factor * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${ticket.impact_factor * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted">Urgency Factor</span>
                  <span className="font-mono font-medium">{Math.round(ticket.urgency_factor * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-status-inprogress rounded-full"
                    style={{ width: `${ticket.urgency_factor * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <span className="text-text-muted block mb-0.5">Assigned Crew</span>
                <span className="font-semibold text-text">{ticket.assigned_to || 'Pending allocation'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
