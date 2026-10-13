import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { RoleGuard } from '@/components/common/RoleGuard'

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage'
import { ReportPage } from '@/pages/public/ReportPage'
import { ConfirmationPage } from '@/pages/public/ConfirmationPage'
import { TrackPage } from '@/pages/public/TrackPage'
import { TransparencyPage } from '@/pages/public/TransparencyPage'
import { PublicModelReportPage } from '@/pages/public/PublicModelReportPage'
import { HelpPage } from '@/pages/public/HelpPage'
import { CreditsPage } from '@/pages/public/CreditsPage'

// Staff Pages
import { StaffDashboardPage } from '@/pages/staff/StaffDashboardPage'
import { StaffTicketDetailPage } from '@/pages/staff/StaffTicketDetailPage'

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { WhatIfSandboxPage } from '@/pages/admin/WhatIfSandboxPage'
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

// Auth & 404
import { LoginPage } from '@/pages/auth/LoginPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="confirmation" element={<ConfirmationPage />} />
        <Route path="confirmation/:trackingCode" element={<ConfirmationPage />} />
        <Route path="track" element={<TrackPage />} />
        <Route path="track/:trackingCode" element={<TrackPage />} />
        <Route path="transparency" element={<TransparencyPage />} />
        <Route path="model-report" element={<PublicModelReportPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="credits" element={<CreditsPage />} />

        {/* Staff Routes (Demo Guard: Staff or Admin) */}
        <Route
          path="staff"
          element={
            <RoleGuard allowedRoles={['staff', 'admin']}>
              <StaffDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="staff/tickets/:id"
          element={
            <RoleGuard allowedRoles={['staff', 'admin']}>
              <StaffTicketDetailPage />
            </RoleGuard>
          }
        />

        {/* Admin Routes (Demo Guard: Admin) */}
        <Route
          path="admin"
          element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/what-if"
          element={
            <RoleGuard allowedRoles={['admin']}>
              <WhatIfSandboxPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/analytics"
          element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminAnalyticsPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/settings"
          element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminSettingsPage />
            </RoleGuard>
          }
        />

        {/* Auth & 404 */}
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
