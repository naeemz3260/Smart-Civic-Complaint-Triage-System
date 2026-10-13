import React, { useEffect, useState } from 'react'
import { fetchCityStats } from '../../api/stats'
import { CityStats } from '../../api/types'
import { BarChart3, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react'

export const TransparencyPage: React.FC = () => {
  const [stats, setStats] = useState<CityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCityStats()
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 text-center text-slate-400">
        Loading civic transparency metrics...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Public Civic Transparency Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time accountability metrics, SLA performance, and departmental distribution.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Logged</span>
            <BarChart3 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total_complaints}</div>
          <span className="text-[11px] text-slate-500">Citizen submissions</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Resolved</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.resolved_count}</div>
          <span className="text-[11px] text-slate-500">Verified closures</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>SLA Compliance</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400">
            {(stats.sla_compliance_rate * 100).toFixed(0)}%
          </div>
          <span className="text-[11px] text-slate-500">Target: 85%+</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Auto-Triage Rate</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {(stats.auto_triage_rate * 100).toFixed(0)}%
          </div>
          <span className="text-[11px] text-slate-500">AI auto-dispatch</span>
        </div>
      </div>

      {/* Category Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase text-slate-300">Category Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(stats.category_distribution).map(([cat, count]) => {
              const pct = ((count / Math.max(1, stats.total_complaints)) * 100).toFixed(0)
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="capitalize">{cat}</span>
                    <span className="font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase text-slate-300">Ward Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.ward_distribution).map(([ward, count]) => {
              const pct = ((count / Math.max(1, stats.total_complaints)) * 100).toFixed(0)
              return (
                <div key={ward} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{ward}</span>
                    <span className="font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
