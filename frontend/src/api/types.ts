export interface StatusEvent {
  id: number
  from_status: string | null
  to_status: string
  actor_role: string
  actor_name: string | null
  comment: string | null
  timestamp: string
}

export interface Complaint {
  id: string
  tracking_code: string
  title: string
  description: string
  language: string
  category: string
  department: string
  latitude: number
  longitude: number
  ward_id: string
  status: string
  priority_score: number
  severity_factor: number
  impact_factor: number
  urgency_factor: number
  vulnerability_factor: number
  confidence: number
  is_critical_override: boolean
  photo_url?: string | null
  after_photo_url?: string | null
  cluster_id?: string | null
  assigned_to?: string | null
  created_at: string
  sla_due_at: string
  resolved_at?: string | null
  closed_at?: string | null
  status_events?: StatusEvent[]
}

export interface CityStats {
  total_complaints: number
  resolved_count: number
  pending_count: number
  breached_count: number
  sla_compliance_rate: number
  auto_triage_rate: number
  category_distribution: Record<string, number>
  ward_distribution: Record<string, number>
}

export interface HotspotPoint {
  id: string
  latitude: number
  longitude: number
  intensity: number
  category: string
  ward_id: string
  count: number
}

export interface ReviewItem {
  review_id: number
  complaint_id: string
  title: string
  description: string
  predicted_category: string
  confidence: number
  reason: string
  ward_id: string
  created_at: string
}

export interface WhatIfItem {
  id: string
  category: string
  original_score: number
  simulated_score: number
  original_rank: number
  simulated_rank: number
  rank_delta: number
}
