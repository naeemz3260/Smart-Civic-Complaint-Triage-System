import en from './en.json'
import ur from './ur.json'
import romanUr from './roman-ur.json'

export type Language = 'en' | 'ur' | 'roman-ur'

const translations: Record<Language, Record<string, string>> = {
  en,
  ur,
  'roman-ur': romanUr
}

export function translate(key: string, lang: Language = 'en'): string {
  return translations[lang]?.[key] || translations.en[key] || key
}
