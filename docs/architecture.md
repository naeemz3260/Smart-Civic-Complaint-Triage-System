# Smart Civic Complaint Triage System Architecture

## 1. High-Level Architecture Overview

The system bridges citizens, automated AI classification & validation pipelines, and municipal dispatch workflows.

```
 Citizen Mobile/Web Portal
      │
      ▼
 FastAPI Gateway (app/main.py)
      │
      ├─► Language & Safety Detector (backend/app/pipeline/language.py)
      ├─► Multi-Modal Fusion Engine (backend/app/pipeline/fusion.py)
      │     ├─► Text Classifier (TF-IDF + Ridge / NLP)
      │     └─► Vision Validator (Image Classifier & Perceptual Hashing)
      │
      ├─► Geospatial Engine (backend/app/pipeline/geo.py)
      │     ├─► Ward Boundaries (wards.geojson)
      │     └─► Sensitive Landmarks Proximity (landmarks.geojson)
      │
      ├─► Explainable Priority Engine (backend/app/priority/engine.py)
      │     Score = w_sev*S + w_imp*I + w_urg*U + w_vuln*V
      │
      ├─► Spatio-Temporal Duplicate & Cluster Service (backend/app/services/cluster_service.py)
      │
      └─► Workflow State Machine & SLA Monitor (backend/app/workflow/)
            ├─► Auto-Dispatch / Low-Confidence Review
            ├─► Field Staff Action & "After" Photo Closure Validation
            └─► Citizen Satisfaction & Transparency Dashboard
```

## 2. Core Subsystems

### Multilingual NLP & Vision Triage
- Ingests free-form citizen text in **English**, **Urdu**, or **Roman Urdu**.
- Normalizes script, strips accents, detects language dialect.
- Checks against safety override dictionary for life-threatening hazards (e.g. fallen live wire, open manhole next to primary school).
- Combines text predictions with image feature embeddings into a calibrated confidence score.
- Low-confidence predictions ($0.50 \le c < 0.75$) automatically route to the **Admin Human-in-the-Loop Review Queue**.

### Explainable Priority Engine
- Every ticket computes a transparent 0-to-1 score with factor breakdowns:
  1. **Severity ($S$)**: Inherent category risk + safety keywords.
  2. **Impact ($I$)**: Estimated population density in ward + number of clustered reports.
  3. **Urgency ($U$)**: Speed of deterioration (e.g. water gushing vs burnt bulb).
  4. **Vulnerability ($V$)**: Proximity boost if within radius of hospitals, schools, or transit arteries.
- Allows municipal commissioners to run "What-If" simulations with custom weights in real-time.

### Field Verification State Machine
- When field staff mark a ticket as `RESOLVED`, they must attach an **After-Resolution Photo**.
- The `ClosureService` validates perceptual difference and landmark persistence between the submission photo and closure photo.
- Admin closure review verifies the repair before changing state to `CLOSED`.
