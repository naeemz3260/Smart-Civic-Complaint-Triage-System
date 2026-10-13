import type {
  Ticket,
  CityStats,
  HotspotPoint,
  ReviewItem,
  WhatIfItem,
  NearbyDuplicate,
  CreateTicketPayload,
  FilterParams,
  Status,
  Role,
  CategoryId,
  PriorityLevel,
} from '@/types'
import {
  MOCK_TICKETS,
  MOCK_CITY_STATS,
  MOCK_HOTSPOTS,
  MOCK_REVIEW_ITEMS,
  MOCK_WHAT_IF,
} from '@/mock/mockData'

// Environment switches
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_URL = import.meta.env.VITE_API_URL || '/api'

// In-memory clone for stateful mock mutations
let mockTicketsStore: Ticket[] = JSON.parse(JSON.stringify(MOCK_TICKETS))

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getStoredRole(): Role {
  const r = localStorage.getItem('civiccare_user_role')
  if (r === 'staff' || r === 'admin') return r
  return 'resident'
}

/**
 * Fetch complaints / tickets list with optional filters
 */
export async function getTickets(params?: FilterParams): Promise<Ticket[]> {
  if (USE_MOCK) {
    await delay(180)
    let filtered = [...mockTicketsStore]

    if (params?.category) {
      filtered = filtered.filter((t) => t.category === params.category)
    }
    if (params?.ward_id) {
      filtered = filtered.filter((t) => t.ward_id === params.ward_id)
    }
    if (params?.status) {
      filtered = filtered.filter((t) => t.status === params.status)
    }
    if (params?.min_priority) {
      filtered = filtered.filter((t) => t.priority_score >= (params.min_priority || 0))
    }
    if (params?.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tracking_code.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    }
    return filtered
  }

  const query = new URLSearchParams()
  if (params?.category) query.append('category', params.category)
  if (params?.ward_id) query.append('ward_id', params.ward_id)
  if (params?.status) query.append('status', params.status)
  if (params?.min_priority) query.append('min_priority', params.min_priority.toString())
  if (params?.limit) query.append('limit', params.limit.toString())

  const res = await fetch(`${API_URL}/complaints?${query.toString()}`, {
    headers: { 'x-role': getStoredRole() },
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Get ticket by UUID
 */
export async function getTicketById(id: string): Promise<Ticket | null> {
  if (USE_MOCK) {
    await delay(150)
    return mockTicketsStore.find((t) => t.id === id) || null
  }

  const res = await fetch(`${API_URL}/complaints/${id}`, {
    headers: { 'x-role': getStoredRole() },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Track complaint by tracking code (e.g., CC-2026-901230)
 */
export async function getTicketByTrackingCode(trackingCode: string): Promise<Ticket | null> {
  if (USE_MOCK) {
    await delay(200)
    const normalized = trackingCode.trim().toUpperCase()
    return mockTicketsStore.find((t) => t.tracking_code.toUpperCase() === normalized) || null
  }

  const res = await fetch(`${API_URL}/tracking/${encodeURIComponent(trackingCode.trim())}`, {
    headers: { 'x-role': getStoredRole() },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Create a new complaint / ticket
 */
export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  if (USE_MOCK) {
    await delay(350)
    const randomCode = `CC-2026-${Math.floor(100000 + Math.random() * 900000)}`
    const category: CategoryId = payload.category || 'pothole'
    const priorityScore = 0.78
    const priorityLevel: PriorityLevel = priorityScore > 0.7 ? 'high' : priorityScore > 0.4 ? 'medium' : 'low'

    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      tracking_code: randomCode,
      title: payload.title,
      description: payload.description,
      language: 'en',
      category,
      department: category === 'pothole' ? 'Road Maintenance Dept' : 'Municipal Services',
      latitude: payload.latitude,
      longitude: payload.longitude,
      ward_id: 'Ward 04',
      status: 'SUBMITTED',
      priority_score: priorityScore,
      priority_level: priorityLevel,
      severity_factor: 0.75,
      impact_factor: 0.80,
      urgency_factor: 0.70,
      vulnerability_factor: 0.50,
      confidence: 0.91,
      is_critical_override: false,
      photo_url: payload.photo_filename ? `/uploads/${payload.photo_filename}` : undefined,
      created_at: new Date().toISOString(),
      sla_due_at: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      status_events: [
        {
          id: Date.now(),
          from_status: null,
          to_status: 'SUBMITTED',
          actor_role: 'resident',
          actor_name: 'Resident Submission',
          comment: 'Initial issue intake via portal',
          timestamp: new Date().toISOString(),
        },
      ],
    }

    mockTicketsStore = [newTicket, ...mockTicketsStore]
    return newTicket
  }

  const res = await fetch(`${API_URL}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-role': getStoredRole(),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Transition ticket status (Workflow engine)
 */
export async function updateTicketStatus(
  id: string,
  toStatus: Status,
  comment?: string,
  assignedTo?: string
): Promise<Ticket> {
  if (USE_MOCK) {
    await delay(250)
    const index = mockTicketsStore.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Ticket not found')

    const ticket = mockTicketsStore[index]
    const updatedEvents = [
      ...(ticket.status_events || []),
      {
        id: Date.now(),
        from_status: ticket.status,
        to_status: toStatus,
        actor_role: getStoredRole(),
        actor_name: getStoredRole() === 'admin' ? 'Municipal Supervisor' : 'Field Operations',
        comment: comment || `Status moved to ${toStatus}`,
        timestamp: new Date().toISOString(),
      },
    ]

    const updated: Ticket = {
      ...ticket,
      status: toStatus,
      assigned_to: assignedTo || ticket.assigned_to,
      resolved_at: toStatus === 'RESOLVED' ? new Date().toISOString() : ticket.resolved_at,
      closed_at: toStatus === 'CLOSED' ? new Date().toISOString() : ticket.closed_at,
      status_events: updatedEvents,
    }

    mockTicketsStore[index] = updated
    return updated
  }

  const res = await fetch(`${API_URL}/workflow/${id}/transition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-role': getStoredRole(),
    },
    body: JSON.stringify({ to_status: toStatus, comment, assigned_to: assignedTo }),
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Verify closure with after photo
 */
export async function verifyClosure(
  id: string,
  afterPhotoFilename: string,
  comment?: string
): Promise<Ticket> {
  if (USE_MOCK) {
    await delay(300)
    const index = mockTicketsStore.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Ticket not found')

    const ticket = mockTicketsStore[index]
    const updated: Ticket = {
      ...ticket,
      status: 'RESOLVED',
      after_photo_url: `/uploads/${afterPhotoFilename}`,
      resolved_at: new Date().toISOString(),
      status_events: [
        ...(ticket.status_events || []),
        {
          id: Date.now(),
          from_status: ticket.status,
          to_status: 'RESOLVED',
          actor_role: 'staff',
          actor_name: 'Field Verification Officer',
          comment: comment || 'Verified work completion with after-repair photo',
          timestamp: new Date().toISOString(),
        },
      ],
    }

    mockTicketsStore[index] = updated
    return updated
  }

  const res = await fetch(`${API_URL}/workflow/${id}/verify-closure`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-role': getStoredRole(),
    },
    body: JSON.stringify({
      after_photo_filename: afterPhotoFilename,
      comment,
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Fetch aggregate civic stats
 */
export async function getCityStats(): Promise<CityStats> {
  if (USE_MOCK) {
    await delay(180)
    return MOCK_CITY_STATS
  }

  const res = await fetch(`${API_URL}/stats`, {
    headers: { 'x-role': getStoredRole() },
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Fetch geographic hotspots
 */
export async function getHotspots(): Promise<HotspotPoint[]> {
  if (USE_MOCK) {
    await delay(200)
    return MOCK_HOTSPOTS
  }

  const res = await fetch(`${API_URL}/hotspots`, {
    headers: { 'x-role': getStoredRole() },
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Fetch review queue (admin only)
 */
export async function getReviewQueue(): Promise<ReviewItem[]> {
  if (USE_MOCK) {
    await delay(150)
    return MOCK_REVIEW_ITEMS
  }

  const res = await fetch(`${API_URL}/review/queue`, {
    headers: { 'x-role': getStoredRole() },
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Admin decision on review item
 */
export async function decideReviewItem(
  reviewItemId: number,
  confirmedCategory: string,
  comment?: string
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    await delay(200)
    return { success: true }
  }

  const res = await fetch(`${API_URL}/review/decide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-role': getStoredRole(),
    },
    body: JSON.stringify({
      review_item_id: reviewItemId,
      confirmed_category: confirmedCategory,
      comment,
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Check nearby duplicates
 */
export async function checkNearbyDuplicates(
  latitude: number,
  longitude: number,
  radiusMeters: number = 60
): Promise<NearbyDuplicate[]> {
  if (USE_MOCK) {
    await delay(180)
    return [
      {
        id: 't-1001',
        title: 'Deep hazardous pothole near school crossing',
        category: 'pothole',
        status: 'IN_PROGRESS',
        distance_meters: 24,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ]
  }

  const res = await fetch(`${API_URL}/nearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-role': getStoredRole(),
    },
    body: JSON.stringify({ latitude, longitude, radius_meters: radiusMeters }),
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}

/**
 * Run What-If simulation
 */
export async function runWhatIfSimulation(weights: {
  severity: number
  impact: number
  urgency: number
  vulnerability: number
}): Promise<WhatIfItem[]> {
  if (USE_MOCK) {
    await delay(250)
    return MOCK_WHAT_IF
  }

  const res = await fetch(`${API_URL}/whatif`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-role': getStoredRole(),
    },
    body: JSON.stringify({
      severity_weight: weights.severity,
      impact_weight: weights.impact,
      urgency_weight: weights.urgency,
      vulnerability_weight: weights.vulnerability,
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.statusText}`)
  return res.json()
}
