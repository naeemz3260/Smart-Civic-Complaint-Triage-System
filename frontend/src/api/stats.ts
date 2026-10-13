import { apiRequest } from './client'
import { CityStats, HotspotPoint, WhatIfItem } from './types'

export async function fetchCityStats(): Promise<CityStats> {
  return apiRequest<CityStats>('/stats')
}

export async function fetchHotspots(): Promise<HotspotPoint[]> {
  return apiRequest<HotspotPoint[]>('/hotspots')
}

export async function simulateWhatIf(weights: {
  severity_weight: number
  impact_weight: number
  urgency_weight: number
  vulnerability_weight: number
}): Promise<WhatIfItem[]> {
  return apiRequest<WhatIfItem[]>('/whatif', {
    method: 'POST',
    body: JSON.stringify(weights),
  })
}

export async function fetchModelReport() {
  return apiRequest('/model-report')
}
