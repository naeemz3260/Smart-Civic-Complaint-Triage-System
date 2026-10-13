import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language } from '../i18n'

export type UserRole = 'resident' | 'staff' | 'admin'

interface AppStateContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  language: Language
  setLanguage: (lang: Language) => void
  reducedMotion: boolean
  setReducedMotion: (reduced: boolean) => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('resident')
  const [language, setLanguage] = useState<Language>('en')
  const [reducedMotion, setReducedMotion] = useState<boolean>(false)

  return (
    <AppStateContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        reducedMotion,
        setReducedMotion,
      }}
    >
      <div className={language === 'ur' ? 'urdu-font' : ''}>
        {children}
      </div>
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
