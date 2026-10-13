import { apiRequest } from './client'
import { Complaint } from './types'

export async function fetchComplaints(params?: {
  category?: string
  ward_id?: string
  status?: string
  min_priority?: number
  limit?: number
}): Promise<Complaint[]> {
  const query = new URLSearchParams()
  if (params?.category) query.append('category', params.category)
  if (params?.ward_id) query.append('ward_id', params.ward_id)
  if (params?.status) query.append('status', params.status)
  if (params?.min_priority) query.append('min_priority', params.min_priority.toString())
  if (params?.limit) query.append('limit', params.limit.toString())

  const queryString = query.toString() ? `?${query.toString()}` : ''
  return apiRequest<Complaint[]>(`/complaints${queryString}`)
}

export async function createComplaint(data: {
  title: string
  description: string
  latitude: number
  longitude: number
  photo_filename?: string
}): Promise<Complaint> {
  return apiRequest<Complaint>('/complaints', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function checkNearbyDuplicates(lat: number, lng: number, category?: string) {
  return apiRequest<any[]>('/nearby', {
    method: 'POST',
    body: JSON.stringify({
      latitude: lat,
      longitude: lng,
      category,
      radius_meters: 60.0
    }),
  })
}

export async function trackByCode(code: string): Promise<Complaint> {
  return apiRequest<Complaint>(`/tracking/${code}`)
}
