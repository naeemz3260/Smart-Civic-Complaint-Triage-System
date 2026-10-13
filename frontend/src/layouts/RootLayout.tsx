import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { TopBar } from '@/components/navigation/TopBar'
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { Layers, ShieldCheck, MapPin, ExternalLink, Activity } from 'lucide-react'

export const RootLayout: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col bg-background text-text antialiased">
      <TopBar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Consistent Institutional Footer */}
      <footer className="border-t border-border bg-card mt-auto text-xs text-text-muted">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div className="md:col-span-5 space-y-3">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-control bg-primary text-white flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-text">CivicCare</span>
              </Link>
              <p className="text-xs text-text-muted leading-relaxed max-w-sm">
                Empowering residents and municipal response teams with multimodal AI triage to route, fix, and verify urban complaints with complete transparency.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-soft text-primary font-medium">
                  <Activity className="w-3 h-3" />
                  <span>Phase 2 Public System</span>
                </span>
                <span className="text-text-muted">·</span>
                <span className="text-text-muted">98% On-Time SLA</span>
              </div>
            </div>

            {/* Col 2: Public Navigation */}
            <div className="md:col-span-4 space-y-2.5">
              <span className="text-xs font-bold text-text uppercase tracking-wider block">
                Public Services
              </span>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home Portal
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="hover:text-primary transition-colors">
                    Report an Issue
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="hover:text-primary transition-colors">
                    Track Complaint Status
                  </Link>
                </li>
                <li>
                  <Link to="/transparency" className="hover:text-primary transition-colors">
                    Transparency Portal & Maps
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-primary transition-colors">
                    Help & FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Attribution & Legal */}
            <div className="md:col-span-3 space-y-2.5">
              <span className="text-xs font-bold text-text uppercase tracking-wider block">
                Attribution & Open Data
              </span>
              <ul className="space-y-2">
                <li>
                  <Link to="/credits" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                    <span>Photo Credits & Licenses</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>&copy; OpenStreetMap Contributors</span>
                  </a>
                </li>
                <li>
                  <span className="text-text-muted">SIL Open Font License (Inter & Noto)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div className="flex flex-wrap items-center gap-4">
              <span>&copy; 2026 Metropolis Civic Corporation. All rights reserved.</span>
              <Link to="/credits" className="text-primary hover:underline">
                Media Credits
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-text-muted">Language:</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
