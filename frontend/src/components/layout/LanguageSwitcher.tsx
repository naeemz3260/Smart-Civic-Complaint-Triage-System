import React from 'react'
import { useAppState } from '../../store/AppStateContext'
import { Language } from '../../i18n'
import { Globe } from 'lucide-react'

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAppState()

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'ur', label: 'اردو' },
    { id: 'roman-ur', label: 'Roman Urdu' },
  ]

  return (
    <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/60 rounded-full px-2 py-0.5 text-xs">
      <Globe className="w-3.5 h-3.5 text-sky-400 mr-1" />
      {languages.map((l) => (
        <button
          key={l.id}
          onClick={() => setLanguage(l.id)}
          className={`px-2 py-1 rounded-full font-medium transition-all ${
            language === l.id
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
