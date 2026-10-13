import React from 'react'
import { useApp } from '@/context/AppContext'
import { Languages } from 'lucide-react'

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useApp()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en')
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-control border border-border bg-card text-text hover:bg-background transition-colors shadow-subtle cursor-pointer select-none"
      title="Switch Language / زبان تبدیل کریں"
    >
      <Languages className="w-3.5 h-3.5 text-primary" />
      <span>{language === 'en' ? 'اردو' : 'EN'}</span>
    </button>
  )
}
