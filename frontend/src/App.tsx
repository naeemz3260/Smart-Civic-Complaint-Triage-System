import React, { useState } from 'react'
import { AppStateProvider, useAppState } from './store/AppStateContext'
import { TopBar } from './components/layout/TopBar'
import { LandingPage } from './pages/public/LandingPage'
import { ReportPage } from './pages/public/ReportPage'
import { TrackPage } from './pages/public/TrackPage'
import { TransparencyPage } from './pages/public/TransparencyPage'
import { StaffTasksPage } from './pages/staff/StaffTasksPage'
import { DashboardPage } from './pages/admin/DashboardPage'

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home')
  const { role } = useAppState()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TopBar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 pb-16">
        {currentTab === 'home' && <LandingPage onNavigate={setCurrentTab} />}
        {currentTab === 'report' && <ReportPage onSuccess={() => setCurrentTab('home')} />}
        {currentTab === 'track' && <TrackPage />}
        {currentTab === 'transparency' && <TransparencyPage />}
        {currentTab === 'staff' && <StaffTasksPage />}
        {currentTab === 'admin' && <DashboardPage />}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Metropolis Civic Complaint Triage & Municipal Dispatch System &copy; 2026. All rights reserved.</p>
        <p className="mt-1">Active Simulation Mode: <span className="uppercase text-sky-400 font-semibold">{role}</span></p>
      </footer>
    </div>
  )
}

export function App() {
  return (
    <AppStateProvider>
      <MainContent />
    </AppStateProvider>
  )
}

export default App
