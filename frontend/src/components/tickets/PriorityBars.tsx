import React from 'react'

interface PriorityBarsProps {
  score: number
  factors?: {
    severity: number
    impact: number
    urgency: number
    vulnerability: number
  }
}

export const PriorityBars: React.FC<PriorityBarsProps> = ({ score, factors }) => {
  const percent = Math.round(score * 100)
  
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  if (score >= 0.8) {
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30 font-bold'
  } else if (score >= 0.6) {
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Priority Score:</span>
        <span className={`px-2 py-0.5 rounded text-[11px] border ${badgeColor}`}>
          {score.toFixed(2)} ({percent}%)
        </span>
      </div>

      {/* Main Score Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div
          className={`h-full transition-all duration-500 ${
            score >= 0.8
              ? 'bg-gradient-to-r from-orange-500 to-rose-500'
              : score >= 0.6
              ? 'bg-gradient-to-r from-amber-400 to-orange-400'
              : 'bg-gradient-to-r from-emerald-400 to-sky-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Breakdown Factors if present */}
      {factors && (
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-[10px] text-slate-400">
          <div>
            <div className="truncate">Sev: {Math.round(factors.severity * 100)}%</div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-400" style={{ width: `${factors.severity * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="truncate">Imp: {Math.round(factors.impact * 100)}%</div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: `${factors.impact * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="truncate">Urg: {Math.round(factors.urgency * 100)}%</div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400" style={{ width: `${factors.urgency * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="truncate">Vuln: {Math.round(factors.vulnerability * 100)}%</div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400" style={{ width: `${factors.vulnerability * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
