import React, { useEffect, useState } from 'react'
import { fetchComplaints } from '../../api/complaints'
import { Complaint } from '../../api/types'
import { TicketCard } from '../../components/tickets/TicketCard'
import { translate } from '../../i18n'
import { useAppState } from '../../store/AppStateContext'
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Zap } from 'lucide-react'

interface LandingPageProps {
  onNavigate: (tab: string) => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { language } = useAppState()
  const [recentTickets, setRecentTickets] = useState<Complaint[]>([])

  useEffect(() => {
    fetchComplaints({ limit: 4 })
      .then(setRecentTickets)
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-16 py-8 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{translate('hero_badge', language)}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {translate('hero_heading', language)}
        </h1>

        <p className="text-base text-slate-400 leading-relaxed">
          {translate('hero_subheading', language)}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('report')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{translate('btn_report_now', language)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('track')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
          >
            {translate('btn_track_code', language)}
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Multilingual NLP & Vision</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Report in English, Urdu (اردو), or Roman Urdu. AI categorizes issues and triggers life-safety overrides immediately.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Geo-Spatial Deduplication</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatic radius scanning alerts citizens of duplicate reports and aggregates ward work orders into unified clusters.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Verified Field Closure</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Field units must upload verified "After" photos compared against initial reports before tickets can be finalized.
          </p>
        </div>
      </section>

      {/* Live Triaged Tickets Stream */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Live Triaged Civic Feed</h3>
            <p className="text-xs text-slate-400">Recently filed and prioritized community work orders</p>
          </div>
          <button
            onClick={() => onNavigate('transparency')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            <span>View All Statistics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentTickets.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      </section>
    </div>
  )
}
