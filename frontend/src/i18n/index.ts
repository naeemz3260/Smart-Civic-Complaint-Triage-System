import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en.json'
import ur from './ur.json'

const resources = {
  en: { translation: en },
  ur: { translation: ur },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

// Sync HTML direction attribute on language change
const applyDirection = (lng: string) => {
  const dir = lng === 'ur' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lng)
}

// Initial application
applyDirection(i18n.language || 'en')

i18n.on('languageChanged', (lng) => {
  applyDirection(lng)
})

export default i18n
