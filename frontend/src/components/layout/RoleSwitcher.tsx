import React from 'react'
import { useAppState, UserRole } from '../../store/AppStateContext'
import { UserCheck, ShieldAlert, HardHat } from 'lucide-react'

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useAppState()

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'resident', label: 'Resident', icon: UserCheck, color: 'text-sky-400' },
    { id: 'staff', label: 'Field Staff', icon: HardHat, color: 'text-amber-400' },
    { id: 'admin', label: 'Admin Command', icon: ShieldAlert, color: 'text-rose-400' },
  ]

  return (
    <div className="flex items-center bg-slate-900/90 border border-slate-700/60 rounded-full p-1 shadow-inner">
      {roles.map((r) => {
        const Icon = r.icon
        const isActive = role === r.id
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              isActive
                ? 'bg-slate-800 text-white shadow-md border border-slate-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? r.color : 'text-slate-500'}`} />
            <span>{r.label}</span>
          </button>
        )
      })}
    </div>
  )
}
