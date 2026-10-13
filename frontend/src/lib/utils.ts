import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind classes safely with clsx and twMerge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format date string to localized readable format
 */
export function formatDate(dateString: string, locale: string = 'en'): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale === 'ur' ? 'ur-PK' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * Format relative time (e.g. 2 hours ago)
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const diff = (new Date().getTime() - new Date(dateString).getTime()) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  } catch {
    return dateString
  }
}
