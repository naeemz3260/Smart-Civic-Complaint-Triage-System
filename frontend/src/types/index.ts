export type Role = 'resident' | 'staff' | 'admin'

export type Status =
  | 'SUBMITTED'
  | 'NEEDS_REVIEW'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED'
  | 'REJECTED'
  | 'ON_HOLD'

export type PriorityLevel = 'high' | 'medium' | 'low'

export type CategoryId =
  | 'pothole'
  | 'sewage'
  | 'electricity'
  | 'water'
  | 'garbage'
  | 'streetlight'

export interface CategoryMeta {
  id: CategoryId
  name: string
  department: string
  default_sla_hours: number
  base_severity: number
  iconName: string
}

export interface StatusEvent {
  id: number
  from_status: Status | string | null
  to_status: Status | string
  actor_role: string
  actor_name: string | null
  comment: string | null
  timestamp: string
}

export interface Ticket {
  id: string
  tracking_code: string
  title: string
  description: string
  language: string
  category: CategoryId
  department: string
  latitude: number
  longitude: number
  ward_id: string
  status: Status
  priority_score: number
  priority_level: PriorityLevel
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

// Backward-compatible alias
export type Complaint = Ticket

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
  category: CategoryId | string
  ward_id: string
  count: number
}

export interface ReviewItem {
  review_id: number
  complaint_id: string
  title: string
  description: string
  predicted_category: CategoryId | string
  confidence: number
  reason: string
  ward_id: string
  created_at: string
}

export interface WhatIfItem {
  id: string
  category: CategoryId | string
  original_score: number
  simulated_score: number
  original_rank: number
  simulated_rank: number
  rank_delta: number
}

export interface NearbyDuplicate {
  id: string
  title: string
  category: CategoryId | string
  status: Status | string
  distance_meters: number
  created_at: string
}

export interface CreateTicketPayload {
  title: string
  description: string
  latitude: number
  longitude: number
  photo_filename?: string
  category?: CategoryId
}

export interface FilterParams {
  category?: CategoryId | string
  ward_id?: string
  status?: Status | string
  min_priority?: number
  search?: string
  limit?: number
  offset?: number
}
