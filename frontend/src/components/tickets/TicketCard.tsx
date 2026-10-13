import React from 'react'
import { StatusPill } from './StatusPill'
import { PriorityBars } from './PriorityBars'
import { Complaint } from '../../api/types'
import { MapPin, Clock, AlertTriangle, Layers } from 'lucide-react'

interface TicketCardProps {
  ticket: Complaint
  onClick?: () => void
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="glass-panel hover:glass-panel-elevated p-4 rounded-xl transition-all duration-300 cursor-pointer border border-slate-800 hover:border-sky-500/40 group space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
            {ticket.tracking_code}
          </span>
          {ticket.is_critical_override && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              SAFETY OVERRIDE
            </span>
          )}
          {ticket.cluster_id && (
            <span className="flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
              <Layers className="w-3 h-3" />
              Clustered
            </span>
          )}
        </div>
        <StatusPill status={ticket.status} />
      </div>

      <div>
        <h4 className="font-semibold text-sm text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1">
          {ticket.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
          {ticket.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span>{ticket.ward_id}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <PriorityBars
        score={ticket.priority_score}
        factors={{
          severity: ticket.severity_factor,
          impact: ticket.impact_factor,
          urgency: ticket.urgency_factor,
          vulnerability: ticket.vulnerability_factor,
        }}
      />
    </div>
  )
}
