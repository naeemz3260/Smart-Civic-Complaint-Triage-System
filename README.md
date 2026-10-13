# Smart Civic Complaint Triage System

Complaint triage you can audit. Every report gets a readable priority score, a duplicate count, an SLA clock, and photo proof before it is closed.

**Live demo**: `<add-link>` · **Demo video**: `<add-link>` · **Slides**: `<add-link>`  
*Built for OpenHack'26, MUET SZAB Campus, Khairpur.*

---

## Table of Contents
1. [Overview](#1-overview)
2. [Feature List](#2-feature-list)
3. [System Architecture](#3-system-architecture)
4. [Repository Structure](#4-repository-structure)
5. [Tech Stack](#5-tech-stack)
6. [Data Model](#6-data-model)
7. [AI Pipeline](#7-ai-pipeline)
8. [Duplicate Detection](#8-duplicate-detection)
9. [Priority Engine](#9-priority-engine)
10. [Workflow, Roles, and SLA](#10-workflow-roles-and-sla)
11. [Closure Verification](#11-closure-verification)
12. [API Reference](#12-api-reference)
13. [Frontend: Pages and Components](#13-frontend-pages-and-components)
14. [3D and Motion Interface](#14-3d-and-motion-interface)
15. [Configuration](#15-configuration)
16. [Setup and Running](#16-setup-and-running)
17. [Testing and Evaluation](#17-testing-and-evaluation)
18. [Security and Privacy](#18-security-and-privacy)
19. [Known Limitations](#19-known-limitations)
20. [Roadmap](#20-roadmap)
21. [Contributing, License, Credits, Team](#21-contributing-license-credits-team)

---

## 1. Overview

### Problem
Residents struggle to report broken streetlights, damaged roads, overflowing bins, water leakage, and blocked drains. Authorities receive reports in scattered formats, cannot easily tell which matter most, see the same problem reported many times, and have no visible accountability for fixing it.

### Solution
A transparent complaint platform that:
- Accepts reports with text, a photo, and a location, in **English**, **Urdu (اردو)**, and **Roman Urdu**;
- Classifies each report from text and image, and routes uncertain cases to a human review queue;
- Groups duplicate reports into one issue with an aggregated report count;
- Ranks issues with an explainable 4-factor score whose factors are always visible and configurable;
- Tracks each ticket through a role-based workflow with SLA timers and an append-only audit log;
- Closes tickets only after after-photo evidence and admin approval, and lets the resident reopen.

### Design Principles
| Principle | What it means in code |
|---|---|
| **Explainable** | The score, its 4 factors, and every classification confidence are stored and shown, never hidden. |
| **Human in the loop** | The system never closes, assigns, or overrides a ticket on its own without verifiable human actions. |
| **Configurable** | Categories, weights, SLAs, and thresholds live in `config/city.yaml`, not hard-coded in source. |
| **Honest AI** | Accuracy figures come from held-out data, and failure cases are displayed in `ml/reports/failures.json`. |
| **Privacy by default** | Sensitive location EXIF metadata is stripped from photos, and data collected is minimal. |

---

## 2. Feature List

| Area | Features |
|---|---|
| **Reporting** | Photo, text, and map pin form; three languages; anonymous option; "already reported nearby" prompt; QR code and tracking code per ticket |
| **AI Triage** | Multilingual text classifier, zero-shot image classifier, multimodal fusion with confidence, low-confidence review queue, safety-keyword override |
| **Duplicates** | Category + distance + text-similarity clustering; manual merge and split |
| **Priority** | Weighted four-factor score with visible factor bars; what-if weight sandbox |
| **Workflow** | Resident, staff, and admin roles; state machine; SLA timers; escalation; audit log |
| **Closure** | Mandatory after-photo upload, automated check as a flag, admin approval, resident reopen window |
| **Insight** | 3D hotspot view, analytics dashboard, public transparency page, CSV and GeoJSON export |
| **Credibility** | In-app model report with held-out metrics, confusion matrix, and failure cases |

---

## 3. System Architecture

```
                  ┌────────────────────────────────────────┐
                  │          Frontend: React + Vite        │
                  │  Pages & Components │ 3D Motion Layer  │
                  └───────────────────┬────────────────────┘
                                      │ HTTP JSON + Multipart
                                      ▼
                  ┌────────────────────────────────────────┐
                  │            Backend: FastAPI            │
                  │  REST API & Roles  │ Core Services     │
                  │  AI Fusion Pipeline│ Priority Engine   │
                  │  Workflow & SLA    │ Audit Logger      │
                  └─────────┬─────────┬──────────┬─────────┘
                            │         │          │
                 ┌──────────▼┐ ┌──────▼──────┐ ┌─▼────────┐
                 │  SQLite   │ │ Media Store │ │ ML Models│
                 └───────────┘ └─────────────┘ └──────────┘
```

---

## 4. Repository Structure

```
smart-civic-complaint-triage/
├── README.md                      # Complete project manual & specification
├── LICENSE                        # MIT License
├── CREDITS.md                     # Open-source library & dataset attributions
├── CONTRIBUTING.md                # Development & PR guidelines
├── docker-compose.yml             # Profiles: lite, full
├── Makefile                       # setup, run, seed, test, evaluate
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git exclusion rules
├── pytest.ini                     # Pytest suite discovery
├── .github/
│   ├── workflows/ci.yml           # GitHub Actions CI for lint, tests, build
│   └── ISSUE_TEMPLATE/            # Bug report templates
│
├── config/
│   └── city.yaml                  # Categories, SLAs, weights, thresholds
│
├── docs/
│   ├── architecture.md            # System architecture details
│   ├── scoring-rules.md           # 4-factor mathematical scoring rules
│   ├── data-format.md             # Schema & GeoJSON definitions
│   ├── openapi.json               # Auto-exported OpenAPI specification
│   └── images/                    # Diagrams and assets
│
├── data/
│   ├── sample/
│   │   ├── complaints.csv         # Labeled training text
│   │   ├── heldout.csv            # Held-out benchmark dataset
│   │   ├── duplicate_pairs.csv    # Labeled pairs for duplicate testing
│   │   └── photos/                # Evidence sample images
│   ├── geo/
│   │   ├── wards.geojson          # Municipal zones for routing
│   │   └── landmarks.geojson      # Schools, hospitals, main roads
│   └── demo/seed.json             # Seeded tickets across all lifecycle states
│
├── ml/
│   ├── train_text_classifier.py   # Multi-lingual model trainer
│   ├── evaluate.py                # Writes ml/reports/metrics.json
│   ├── download_models.py         # Model download hook
│   ├── reports/                   # metrics.json & failures.json
│   └── models/                    # Model binary weights (gitignored)
│
├── scripts/
│   ├── seed_demo.py               # Populates database
│   ├── strip_exif.py              # Strips EXIF metadata from uploads
│   └── export_openapi.py          # Generates API schema for frontend types
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py                # App creation, CORS, router registration
│   │   ├── core/                  # config.py, database.py, roles.py
│   │   ├── models/                # complaint, cluster, status_event, attachment, review_item, closure_check, user
│   │   ├── schemas/               # Pydantic v2 schemas
│   │   ├── api/                   # REST endpoints: complaints, nearby, workflow, review, clusters, tracking, stats, hotspots, whatif, health
│   │   ├── services/              # complaint, cluster, closure, media, notification, audit
│   │   ├── pipeline/              # embeddings, text_classifier, image_classifier, fusion, language, keywords, geo
│   │   ├── priority/              # engine.py, factors.py
│   │   ├── workflow/              # state_machine.py, sla_jobs.py, escalation.py
│   │   └── seed/demo_data.py      # Seed implementation
│   └── tests/                     # 14 passing unit tests covering all components
│
└── frontend/
    ├── FRONTEND_GUIDE.md          # Dedicated onboarding & contract guide for teammates
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── index.html
    └── src/
        ├── main.tsx & App.tsx
        ├── api/                   # client.ts, complaints.ts, workflow.ts, stats.ts, types.ts, mockData.ts
        ├── store/                 # AppStateContext (Role, Language, Motion)
        ├── i18n/                  # en.json, ur.json, roman-ur.json, index.ts
        ├── components/            # layout/, forms/, tickets/, maps/, charts/, common/
        └── pages/                 # public/ (Landing, Report, Track, Transparency), staff/, admin/
```

---

## 5. Tech Stack

- **Backend**: FastAPI, Pydantic, SQLAlchemy 2.x, SQLite.
- **AI Pipeline**: Multilingual Sentence Embeddings / TF-IDF, Scikit-Learn Logistic Regression, CLIP Vision Triage & Perceptual Hashing.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas 2D/3D visualizers.
- **Workflow & Testing**: Pytest, GitHub Actions CI, Docker & Docker Compose.

---

## 6. Setup and Running

### Option A: Local Development
```bash
# 1. Backend Setup
cd backend
python -m pip install -r requirements.txt
python -m app.seed.demo_data
uvicorn app.main:app --reload --port 8000

# 2. Frontend Setup (in a new terminal)
cd frontend
npm install
npm run dev
```

### Option B: Docker Compose
```bash
# Run lightweight profile (SQLite + mocked services)
docker compose --profile lite up --build
```

---

## 7. Contributing, License, Credits & Team
- **License**: MIT License (see [LICENSE](LICENSE)). Sample datasets under CC BY 4.0.
- **Credits**: Listed in [CREDITS.md](CREDITS.md).
- **Contributing**: Follow the workflow in [CONTRIBUTING.md](CONTRIBUTING.md).
- **Team**:
  - Data & ML: `<name>`
  - Backend: `<name>`
  - Frontend & 3D Interface: `<name>`
  - Docs, Demo & Packaging: `<name>`
  - *Built for OpenHack'26, MUET SZAB Campus, Khairpur.*
