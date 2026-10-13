import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Role } from '@/types'

export interface UserProfile {
  id?: string | number
  username: string
  role: Role
  full_name: string
  department?: string
}

interface AppContextType {
  role: Role
  setRole: (role: Role) => void
  currentUser: UserProfile | null
  login: (profile: UserProfile) => void
  logout: () => void
  registerStaff: (username: string, fullName: string, department: string) => void
  language: string
  setLanguage: (lang: 'en' | 'ur') => void
  isRtl: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const ROLE_STORAGE_KEY = 'civiccare_user_role'
const USER_STORAGE_KEY = 'civiccare_current_user'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation()

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (savedUser) return JSON.parse(savedUser)
    } catch {
      // fallback
    }
    return null
  })

  const [role, setRoleState] = useState<Role>(() => {
    if (currentUser?.role) return currentUser.role
    const saved = localStorage.getItem(ROLE_STORAGE_KEY)
    if (saved === 'resident' || saved === 'staff' || saved === 'admin') {
      return saved
    }
    return 'resident'
  })

  const [language, setLanguageState] = useState<string>(i18n.language || 'en')

  const setRole = (newRole: Role) => {
    setRoleState(newRole)
    localStorage.setItem(ROLE_STORAGE_KEY, newRole)
  }

  const login = (profile: UserProfile) => {
    setCurrentUser(profile)
    setRole(profile.role)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile))
  }

  const logout = () => {
    setCurrentUser(null)
    setRole('resident')
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  const registerStaff = (username: string, fullName: string, department: string) => {
    const newStaff: UserProfile = {
      username,
      full_name: fullName,
      department,
      role: 'staff',
    }
    login(newStaff)
  }

  const setLanguage = (newLang: 'en' | 'ur') => {
    i18n.changeLanguage(newLang)
    setLanguageState(newLang)
  }

  useEffect(() => {
    const handleLangChange = (lng: string) => {
      setLanguageState(lng)
    }
    i18n.on('languageChanged', handleLangChange)
    return () => {
      i18n.off('languageChanged', handleLangChange)
    }
  }, [i18n])

  const isRtl = language === 'ur'

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        login,
        logout,
        registerStaff,
        language,
        setLanguage,
        isRtl,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
