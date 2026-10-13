# CivicCare - Frontend Architecture & Phase 1 Foundation Guide

## 1. Overview
CivicCare is a production-quality civic complaint triage frontend designed to match the 15-screen institutional municipal specification.

## 2. Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS, PostCSS, class-variance-authority, clsx, tailwind-merge
- **Routing**: React Router v6
- **Server State**: TanStack Query v5 (`@tanstack/react-query`)
- **Localization**: react-i18next (English & Urdu RTL)
- **Data & Visuals**: Leaflet / react-leaflet, Recharts, Lucide React, qrcode.react, Framer Motion
- **Mock / API Layer**: Unified `src/lib/api.ts` switchable via `VITE_USE_MOCK` and `VITE_API_URL`

## 3. Design System Tokens
All design tokens are defined in [src/styles/tokens.css](file:///c:/Users/Ali%20Nawaz/Desktop/Smart-Civic-Complaint-Triage-System/frontend/src/styles/tokens.css) and exposed via [tailwind.config.ts](file:///c:/Users/Ali%20Nawaz/Desktop/Smart-Civic-Complaint-Triage-System/frontend/tailwind.config.ts):
- **Brand Primary**: `#1E8E6E` (hover: `#166F57`, soft: `#E6F4EF`)
- **Background**: `#F5F8F7`, **Card**: `#FFFFFF`
- **Text**: `#14231F`, **Muted**: `#6B7C77`, **Border**: `#E3EAE7`
- **High Priority**: `#E8731A` / `#FDEBD8`
- **Medium Priority**: `#B88A0B` / `#FBF1D3`
- **Low Priority**: `#2E9E6B` / `#E3F5EC`
- **In Progress**: `#2F7DD1` / `#E3EEFA`
- **Resolved**: `#2E9E6B` / `#E3F5EC`
- **On Hold**: `#D64545` / `#FBE6E6`
- **Grid & Sizing**: 4px grid, 12px card radius, 8px control radius, max content width 1200px.
- **Typography**: Inter (English), Noto Nastaliq Urdu (headings & paragraphs in Urdu), Noto Naskh Arabic (Urdu controls).

## 4. Folder Structure
```
frontend/
├── public/
│   └── civiccare_reference_screens.jpg  # Preserved 15-screen master reference
├── src/
│   ├── components/
│   │   ├── common/         # PageContainer, RoleGuard, EmptyState, ErrorState
│   │   ├── navigation/     # TopBar, RoleSwitcher, LanguageSwitcher
│   │   └── ui/             # Button, Input, Card, Badge, Skeleton, CivicImage
│   ├── context/            # AppContext (role & language states)
│   ├── i18n/               # i18next configuration, en.json, ur.json
│   ├── layouts/            # RootLayout with header & footer
│   ├── lib/                # api.ts (mock/backend switchable client), utils.ts
│   ├── mock/               # High-fidelity mock tickets, stats, hotspots
│   ├── pages/
│   │   ├── admin/          # AdminDashboard, WhatIfSandbox, AdminAnalytics, AdminSettings
│   │   ├── auth/           # LoginPage placeholder
│   │   ├── not-found/      # NotFoundPage (404)
│   │   ├── public/         # Landing, Report, Confirmation, Track, Transparency, ModelReport
│   │   └── staff/          # StaffDashboard, StaffTicketDetail
│   ├── routes/             # AppRoutes with role-guarded demo routes
│   ├── styles/             # tokens.css, index.css
│   └── types/              # Role, Status, CategoryId, Ticket, etc.
```

## 5. Development Commands
```bash
npm install
npm run dev     # Starts Vite dev server at http://localhost:5173
npm run build   # Typechecks and creates production bundle
```
