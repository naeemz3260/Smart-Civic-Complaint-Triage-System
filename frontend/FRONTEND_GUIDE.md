# Frontend Team Developer Onboarding & API Contract Guide

Welcome to the frontend development team for the **Smart Civic Complaint Triage System**! This document provides everything you need to build, iterate, and integrate the frontend without needing to touch the backend or ML internals.

---

## 🚀 Quick Setup for Frontend Developers

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- (Optional) Running backend API at `http://localhost:8000` (or use the mock fallback responses outlined below).

### 2. Getting the Frontend Running
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start at `http://localhost:5173`.

### 3. API Proxy Configuration
Vite is already pre-configured in [vite.config.ts](file:///c:/Users/Ali%20Nawaz/Desktop/Smart-Civic-Complaint-Triage-System/frontend/vite.config.ts) to automatically proxy requests:
- `/api/*` ➔ `http://127.0.0.1:8000/api/*`
- `/uploads/*` ➔ `http://127.0.0.1:8000/uploads/*`

---

## 📁 Frontend Directory Organization & Architecture

The frontend directory is structured so multiple teammates can work independently on separate components, pages, or features:

```
frontend/
├── index.html                   # HTML entrypoint (Google Fonts & metadata configured)
├── package.json                 # Dependencies (React 18, Tailwind, Lucide icons)
├── vite.config.ts               # Vite bundler & reverse proxy
├── tailwind.config.ts           # Civic color palette & dark-mode classes
│
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root app layout & view routing
│   │
│   ├── api/                     # ⚡ API Integration Layer (Fully Typed)
│   │   ├── client.ts            # Base fetch wrapper with 'x-role' headers
│   │   ├── types.ts             # TypeScript interfaces matching backend models
│   │   ├── complaints.ts        # Submit, list, filter, search, & nearby duplicates
│   │   ├── workflow.ts          # State transitions, closure verification, review queue
│   │   └── stats.ts             # City KPIs, 3D hotspots, & What-If simulation
│   │
│   ├── store/
│   │   └── AppStateContext.tsx   # Global Context: Role ('resident' | 'staff' | 'admin'),
│   │                            # Language ('en' | 'ur' | 'roman-ur'), reduced motion
│   │
│   ├── i18n/                    # 🌐 Multilingual Dictionaries
│   │   ├── en.json              # English labels & placeholders
│   │   ├── ur.json              # Urdu (اردو) with RTL typography support
│   │   ├── roman-ur.json        # Roman Urdu colloquial phrases
│   │   └── index.ts             # translate(key, lang) helper function
│   │
│   ├── components/              # 🧩 Reusable UI Components
│   │   ├── layout/              # TopBar, RoleSwitcher, LanguageSwitcher
│   │   ├── tickets/             # TicketCard, PriorityBars, StatusPill, BeforeAfterSlider
│   │   ├── maps/                # MapView2D (interactive canvas pin), HotspotScene3D (isometric 3D)
│   │   └── common/              # Modals, loaders, and alerts
│   │
│   ├── pages/                   # 📱 Screen Views (Separated by User Role)
│   │   ├── public/              # Resident Portal:
│   │   │   ├── LandingPage.tsx       # Hero, service guide, live ticket feed
│   │   │   ├── ReportPage.tsx        # Wizard with map pin, photo picker & duplicate warning
│   │   │   ├── TrackPage.tsx         # Real-time tracking code lookup & audit timeline
│   │   │   └── TransparencyPage.tsx  # SLA charts, ward distribution, & public KPIs
│   │   │
│   │   ├── staff/               # Field Operations:
│   │   │   └── StaffTasksPage.tsx    # Work order queue & mandatory before/after photo closure
│   │   │
│   │   └── admin/               # Municipal HQ:
│   │       └── DashboardPage.tsx     # Triage queue, low-confidence review, 3D hotspots & What-If sandbox
│   │
│   └── styles/
│       ├── globals.css          # Glassmorphic CSS classes & scrollbars
│       └── tokens.css           # CSS variables for themes & accents
```

---

## 🔌 API Endpoints & Contract Reference

All endpoints return JSON and accept standard payloads. The full OpenAPI specification is also exported at [docs/openapi.json](file:///c:/Users/Ali%20Nawaz/Desktop/Smart-Civic-Complaint-Triage-System/docs/openapi.json).

### 1. Citizen Endpoints
| Action | Method | Path | Request Body / Query | Role Required |
|---|---|---|---|---|
| Submit Complaint | `POST` | `/api/complaints` | `{ title, description, latitude, longitude, photo_filename? }` | Resident |
| List Complaints | `GET` | `/api/complaints` | `?category=&ward_id=&status=&min_priority=&limit=` | Any |
| Check Duplicates | `POST` | `/api/nearby` | `{ latitude, longitude, radius_meters: 60 }` | Any |
| Track by Token | `GET` | `/api/tracking/{code}` | None (`/api/tracking/TRK-91823`) | Any |

### 2. Field Staff Endpoints
| Action | Method | Path | Request Body / Query | Role Required |
|---|---|---|---|---|
| Verify Closure | `POST` | `/api/workflow/{id}/verify-closure` | `{ after_photo_filename, comment }` | Staff (`x-role: staff`) |
| Change Status | `POST` | `/api/workflow/{id}/transition` | `{ to_status: "IN_PROGRESS", comment? }` | Staff (`x-role: staff`) |

### 3. Municipal Admin Endpoints
| Action | Method | Path | Request Body / Query | Role Required |
|---|---|---|---|---|
| Review Queue | `GET` | `/api/review/queue` | None | Admin (`x-role: admin`) |
| Confirm Review | `POST` | `/api/review/decide` | `{ review_item_id, confirmed_category, comment? }` | Admin (`x-role: admin`) |
| Merge Clusters | `POST` | `/api/clusters/merge` | `{ cluster_id, target_cluster_id }` | Admin (`x-role: admin`) |
| Run "What-If" | `POST` | `/api/whatif` | `{ severity_weight, impact_weight, urgency_weight, vulnerability_weight }` | Admin |
| 3D Hotspots | `GET` | `/api/hotspots` | None | Any |
| Civic Stats | `GET` | `/api/stats` | None | Any |

---

## 🎨 Theme & Styling Utilities

The frontend uses Tailwind CSS with customized civic design tokens:

### Custom Tailwind Classes
- **Glassmorphic Cards**: `glass-panel` (subtle blur background) and `glass-panel-elevated` (hover highlight).
- **Glow Accents**: `glow-sky` (active highlights), `glow-red` (critical hazard warnings).
- **Colors**:
  - `bg-civic-500` through `bg-civic-900` for municipal blues.
  - `text-hazard-critical` (`#ef4444`) for high-priority / safety alerts.
  - `text-hazard-warning` (`#f59e0b`) for SLA warnings.
  - `text-hazard-safe` (`#10b981`) for resolved & verified tickets.

### Language & RTL Typography
When the language is switched to Urdu (`ur`), the layout dynamically applies:
```css
.urdu-font {
  font-family: 'Noto Nastaliq Urdu', 'Plus Jakarta Sans', sans-serif;
  direction: rtl;
}
```

---

## 👥 How Your Teammate Can Work on This

1. **Working on UI/UX Only**:
   - Edit files inside `frontend/src/pages/` and `frontend/src/components/`.
   - All styling can be tweaked in Tailwind or `src/styles/globals.css`.
2. **Adding New Pages or Views**:
   - Add the new view inside `frontend/src/pages/`.
   - Register the view in [frontend/src/App.tsx](file:///c:/Users/Ali%20Nawaz/Desktop/Smart-Civic-Complaint-Triage-System/frontend/src/App.tsx) and navigation bar in [frontend/src/components/layout/TopBar.tsx](file:///c:/Users/Ali%20Nawaz/Desktop/Smart-Civic-Complaint-Triage-System/frontend/src/components/layout/TopBar.tsx).
3. **Running the Full Stack**:
   - Teammate can run `npm run dev` in `frontend/`.
   - In another terminal, run `uvicorn backend.app.main:app --reload --port 8000` to have real backend responses.
