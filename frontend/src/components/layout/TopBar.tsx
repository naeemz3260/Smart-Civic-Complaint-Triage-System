import React from 'react'
import { RoleSwitcher } from './RoleSwitcher'
import { LanguageSwitcher } from './LanguageSwitcher'
import { translate } from '../../i18n'
import { useAppState } from '../../store/AppStateContext'
import { Building2, PlusCircle, Search, BarChart3, Shield, HardHat } from 'lucide-react'

interface TopBarProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab, setCurrentTab }) => {
  const { language, role } = useAppState()

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              METROPOLIS <span className="text-sky-400 font-light">CIVIC</span>
            </span>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase">
              Automated Triage & Dispatch
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'home' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'report' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {translate('nav_report', language)}
          </button>
          <button
            onClick={() => setCurrentTab('track')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'track' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            {translate('nav_track', language)}
          </button>
          <button
            onClick={() => setCurrentTab('transparency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'transparency' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {translate('nav_transparency', language)}
          </button>

          {/* Role-Specific quick views */}
          {role === 'staff' && (
            <button
              onClick={() => setCurrentTab('staff')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30`}
            >
              <HardHat className="w-3.5 h-3.5" />
              Staff Tasks
            </button>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Center
            </button>
          )}
        </nav>

        {/* Controls: Role & Language */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <RoleSwitcher />
        </div>
      </div>
    </header>
  )
}
