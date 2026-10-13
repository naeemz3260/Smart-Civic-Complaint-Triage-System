import { mockComplaints, mockCityStats } from './mockData'

const BASE_URL = '/api'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  role: string = 'resident'
): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('x-role', role)

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`API Error [${response.status}]: ${errorBody}`)
    }

    return response.json()
  } catch (err) {
    // Graceful offline development fallback for teammate
    console.warn(`[DEV FALLBACK] Backend unreachable at ${endpoint}. Returning mock data.`, err)
    if (endpoint.startsWith('/complaints')) {
      return mockComplaints as unknown as T
    }
    if (endpoint.startsWith('/stats')) {
      return mockCityStats as unknown as T
    }
    if (endpoint.startsWith('/tracking')) {
      return mockComplaints[0] as unknown as T
    }
    throw err
  }
}
