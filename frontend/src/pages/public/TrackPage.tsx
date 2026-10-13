import React, { useState } from 'react'
import { trackByCode } from '../../api/complaints'
import { Complaint } from '../../api/types'
import { StatusPill } from '../../components/tickets/StatusPill'
import { PriorityBars } from '../../components/tickets/PriorityBars'
import { translate } from '../../i18n'
import { useAppState } from '../../store/AppStateContext'
import { Search, MapPin, Calendar, CheckCircle2, QrCode } from 'lucide-react'

export const TrackPage: React.FC = () => {
  const { language } = useAppState()
  const [code, setCode] = useState('')
  const [ticket, setTicket] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return
    setLoading(true)
    setError(null)
    try {
      const result = await trackByCode(code.trim().toUpperCase())
      setTicket(result)
    } catch (err: any) {
      setError('Ticket code not found. Please verify your tracking code.')
      setTicket(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">
          {translate('nav_track', language)}
        </h1>
        <p className="text-sm text-slate-400">
          Enter your 8-character civic reference code to see live triage status and audit timeline.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. TRK-91823"
          className="flex-1 uppercase font-mono bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      {ticket && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-sky-400">
                  {ticket.tracking_code}
                </span>
                <StatusPill status={ticket.status} />
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{ticket.title}</h2>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>MCC Verified Token</span>
            </div>
          </div>

          <p className="text-sm text-slate-300">{ticket.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Department</span>
              <span className="font-semibold text-slate-200">{ticket.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ward</span>
              <span className="font-semibold text-slate-200">{ticket.ward_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Submitted</span>
              <span className="font-semibold text-slate-200">
                {new Date(ticket.created_at).toLocaleDateString()}
              </span>
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

          {/* Audit Timeline */}
          {ticket.status_events && ticket.status_events.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verification & Audit History
              </h4>
              <div className="space-y-3">
                {ticket.status_events.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{evt.to_status}</span>
                        <span className="text-slate-500">by {evt.actor_name || evt.actor_role}</span>
                      </div>
                      {evt.comment && <p className="text-slate-400 text-[11px]">{evt.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
