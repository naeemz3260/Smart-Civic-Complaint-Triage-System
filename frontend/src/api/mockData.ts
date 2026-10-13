import { Complaint, CityStats, HotspotPoint, ReviewItem, WhatIfItem } from './types'

export const mockComplaints: Complaint[] = [
  {
    id: "MCC-2026-0001",
    tracking_code: "TRK-91823",
    title: "Severe road cavity on Main Boulevard near Hospital",
    description: "Massive deep pothole on main road causing serious traffic jams and motorcycle slips near General Teaching Hospital.",
    language: "en",
    category: "pothole",
    department: "Road Maintenance Dept",
    latitude: 24.8562,
    longitude: 67.0261,
    ward_id: "WARD-02",
    status: "IN_PROGRESS",
    priority_score: 0.88,
    severity_factor: 0.75,
    impact_factor: 0.90,
    urgency_factor: 0.85,
    vulnerability_factor: 1.00,
    confidence: 0.94,
    is_critical_override: false,
    photo_url: "/photos/pothole_before.jpg",
    after_photo_url: null,
    cluster_id: "CLU-101",
    assigned_to: "Engr. Salman Khan",
    created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    sla_due_at: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    status_events: [
      {
        id: 1,
        from_status: null,
        to_status: "SUBMITTED",
        actor_role: "resident",
        actor_name: "Resident Web",
        comment: "Complaint submitted",
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
      },
      {
        id: 2,
        from_status: "SUBMITTED",
        to_status: "IN_PROGRESS",
        actor_role: "staff",
        actor_name: "Field Unit 3",
        comment: "Crew deployed on site",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: "MCC-2026-0002",
    tracking_code: "TRK-44021",
    title: "Dangerous Live Electric Wire Snapped on Street",
    description: "Bijli ka taar toot kar zameen pe gir gaya hai current lagne ka khatra. Sparking happening right near bus stop.",
    language: "roman_ur",
    category: "electricity",
    department: "Power Distribution Corp",
    latitude: 24.8320,
    longitude: 67.0345,
    ward_id: "WARD-01",
    status: "ASSIGNED",
    priority_score: 0.98,
    severity_factor: 1.00,
    impact_factor: 0.95,
    urgency_factor: 1.00,
    vulnerability_factor: 0.85,
    confidence: 0.99,
    is_critical_override: true,
    photo_url: "/photos/live_wire.jpg",
    after_photo_url: null,
    cluster_id: null,
    assigned_to: "Rapid Emergency Power Unit 4",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    sla_due_at: new Date(Date.now() + 10 * 3600 * 1000).toISOString()
  }
]

export const mockCityStats: CityStats = {
  total_complaints: 48,
  resolved_count: 36,
  pending_count: 12,
  breached_count: 2,
  sla_compliance_rate: 0.89,
  auto_triage_rate: 0.82,
  category_distribution: {
    pothole: 14,
    sewage: 11,
    electricity: 9,
    water: 7,
    garbage: 5,
    streetlight: 2
  },
  ward_distribution: {
    "WARD-01": 15,
    "WARD-02": 18,
    "WARD-03": 9,
    "WARD-04": 6
  }
}
