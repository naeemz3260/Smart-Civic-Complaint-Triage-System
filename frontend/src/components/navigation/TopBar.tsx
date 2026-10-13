import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '@/context/AppContext'
import {
  Layers,
  FilePlus,
  Search,
  BarChart3,
  HelpCircle,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  Wrench,
  Shield,
  ExternalLink,
} from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const TopBar: React.FC = () => {
  const { t } = useTranslation()
  const { role, currentUser, logout, isRtl } = useApp()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  // Public navigation links
  const publicLinks = [
    { to: '/', label: t('nav.home', { defaultValue: 'Home' }) },
    { to: '/report', label: t('nav.report', { defaultValue: 'Report' }) },
    { to: '/track', label: t('nav.track', { defaultValue: 'Track' }) },
    { to: '/transparency', label: t('nav.transparency', { defaultValue: 'Transparency' }) },
    { to: '/help', label: 'Help' },
  ]

  // Role portal shortcut ONLY when authenticated
  const authenticatedRoleLink =
    currentUser?.role === 'staff'
      ? { to: '/staff', label: 'Staff Portal', icon: Wrench }
      : currentUser?.role === 'admin'
      ? { to: '/admin', label: 'Admin HQ', icon: Shield }
      : null

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md transition-all">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-control bg-primary text-white flex items-center justify-center shadow-subtle group-hover:bg-primary-hover transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-text leading-tight group-hover:text-primary transition-colors">
                {t('brand.name', { defaultValue: 'CivicCare' })}
              </span>
              <span className="text-[10px] text-text-muted hidden sm:inline leading-none font-medium">
                Municipal Triage
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Visible >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicLinks.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-control transition-colors',
                    isActive
                      ? 'text-primary bg-primary-soft'
                      : 'text-text-muted hover:text-text hover:bg-background'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* If logged in as staff or admin, display their active workspace link */}
            {authenticatedRoleLink && (
              <Link
                to={authenticatedRoleLink.to}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-control transition-colors ms-2',
                  location.pathname.startsWith(authenticatedRoleLink.to)
                    ? 'text-primary bg-primary-soft'
                    : 'bg-primary-soft/60 text-primary hover:bg-primary-soft'
                )}
              >
                <authenticatedRoleLink.icon className="w-3.5 h-3.5" />
                <span>{authenticatedRoleLink.label}</span>
              </Link>
            )}
          </nav>

          {/* Desktop Right Controls (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {currentUser ? (
              <div className="flex items-center gap-2.5 ps-2 border-s border-border">
                <div className="flex flex-col text-end">
                  <span className="text-xs font-semibold text-text leading-tight">
                    {currentUser.full_name || currentUser.username}
                  </span>
                  <span className="text-[10px] text-text-muted capitalize">
                    {currentUser.role} {currentUser.department ? `· ${currentUser.department}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-text-muted hover:text-status-onhold transition-colors rounded-control hover:bg-status-onhold-soft"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" className="gap-1.5 shadow-subtle">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('nav.login', { defaultValue: 'Sign In' })}</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile / Tablet Header Controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-control text-text hover:bg-background border border-border"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in Full Height Drawer (< 1024px) */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-text/40 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Full height slide-in drawer panel */}
          <div
            className={cn(
              'relative z-50 w-[290px] sm:w-[320px] max-w-[85vw] h-full bg-card shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out',
              isRtl ? 'me-auto' : 'ms-auto'
            )}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <Link to="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                  <div className="w-8 h-8 rounded-control bg-primary text-white flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-text">CivicCare</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-control text-text-muted hover:text-text hover:bg-background"
                  aria-label="Close Navigation Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links list */}
              <nav className="flex flex-col space-y-1.5 py-6">
                {publicLinks.map((item) => {
                  const isActive = location.pathname === item.to
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        'flex items-center px-3.5 py-2.5 rounded-control text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-primary-soft text-primary'
                          : 'text-text hover:bg-background'
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}

                {authenticatedRoleLink && (
                  <Link
                    to={authenticatedRoleLink.to}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-control text-sm font-semibold bg-primary-soft text-primary mt-2"
                  >
                    <authenticatedRoleLink.icon className="w-4 h-4" />
                    <span>{authenticatedRoleLink.label}</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-border space-y-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-control bg-background border border-border">
                    <p className="text-xs font-semibold text-text">{currentUser.full_name || currentUser.username}</p>
                    <p className="text-[11px] text-text-muted capitalize">
                      {currentUser.role} {currentUser.department ? `· ${currentUser.department}` : ''}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-full text-status-onhold hover:bg-status-onhold-soft gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="block">
                  <Button variant="primary" size="md" className="w-full gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>{t('nav.login', { defaultValue: 'Sign In' })}</span>
                  </Button>
                </Link>
              )}

              <div className="flex items-center justify-between text-xs text-text-muted pt-2">
                <Link to="/credits" className="hover:underline">
                  Credits & Licenses
                </Link>
                <span>v1.0 Phase 2</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
