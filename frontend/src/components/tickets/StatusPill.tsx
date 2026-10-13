import React from 'react'

interface StatusPillProps {
  status: string
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  let color = 'bg-slate-700/50 text-slate-300 border-slate-600'

  switch (status) {
    case 'SUBMITTED':
      color = 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      break
    case 'TRIAGED':
      color = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
      break
    case 'ASSIGNED':
      color = 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      break
    case 'IN_PROGRESS':
      color = 'bg-sky-500/20 text-sky-300 border-sky-400/40 animate-pulse'
      break
    case 'RESOLVED':
      color = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
      break
    case 'CLOSED':
      color = 'bg-teal-500/20 text-teal-300 border-teal-500/50'
      break
    case 'NEEDS_REVIEW':
      color = 'bg-purple-500/15 text-purple-300 border-purple-500/40'
      break
    case 'REJECTED':
      color = 'bg-rose-500/15 text-rose-300 border-rose-500/40'
      break
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${color}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
