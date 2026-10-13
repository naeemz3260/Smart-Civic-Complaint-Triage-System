# Data Formats & Schemas

## 1. Complaint Record Schema (CSV & JSON)

Each complaint record contains the following standardized fields:

| Field | Type | Description |
|---|---|---|
| `id` | String / UUID | Unique ticket identifier (e.g., `MCC-2026-0042`) |
| `tracking_code` | String | 8-character public token for resident lookup (e.g., `TRK-88219`) |
| `title` | String | Citizen-provided short title or auto-generated summary |
| `description` | String | Raw text submitted by citizen (English, Urdu, or Roman Urdu) |
| `category` | String | One of: `pothole`, `sewage`, `electricity`, `water`, `garbage`, `streetlight` |
| `latitude` | Float | WGS84 Latitude |
| `longitude` | Float | WGS84 Longitude |
| `ward_id` | String | Inferred or assigned municipal ward (e.g., `WARD-01`) |
| `status` | String | State: `SUBMITTED`, `TRIAGED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REJECTED`, `NEEDS_REVIEW` |
| `priority_score`| Float | Composite priority score between `0.0` and `1.0` |
| `confidence` | Float | Model triage confidence score between `0.0` and `1.0` |
| `created_at` | ISO-8601 | Submission timestamp |
| `sla_due_at` | ISO-8601 | Calculated resolution deadline |
| `photo_url` | String | Path to initial evidence photo |
| `after_photo_url`| String | Path to completion evidence photo |

## 2. GeoJSON Schema (Wards & Landmarks)
- **Wards**: Polygons or MultiPolygons with properties: `ward_id`, `name`, `population_density`, `lead_officer`.
- **Landmarks**: Point features with properties: `name`, `type` (`hospital`, `school`, `main_road`), `capacity`.
