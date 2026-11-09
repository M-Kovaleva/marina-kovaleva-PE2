import { apiFetch } from './apiFetch'
import type { ApiListResponse, ApiResponse } from '../types/api'
import type { Location, Media, Venue, VenueMeta } from '../types/venue'

/** Fields a venue manager fills in the Create / Edit venue form */
export interface VenueData {
  name: string
  description: string
  price: number
  maxGuests: number
  media?: Media[]
  meta?: Partial<VenueMeta>
  location?: Partial<Location>
}

/**
 * Gets one page of venues, newest first, with their bookings
 * (bookings are needed to hide venues that are taken on the chosen dates)
 */
export function getVenues(page = 1, limit = 24, signal?: AbortSignal) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort: 'created',
    sortOrder: 'desc',
    _bookings: 'true',
  })
  return apiFetch<ApiListResponse<Venue>>(`/holidaze/venues?${params}`, { signal })
}

/**
 * Searches venues by name and description
 */
export function searchVenues(query: string, page = 1, limit = 24, signal?: AbortSignal) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
    _bookings: 'true',
  })
  return apiFetch<ApiListResponse<Venue>>(`/holidaze/venues/search?${params}`, { signal })
}

/**
 * Gets one venue with its owner and bookings (for the calendar and Edit / Delete)
 */
export async function getVenue(id: string, signal?: AbortSignal): Promise<Venue> {
  const res = await apiFetch<ApiResponse<Venue>>(
    `/holidaze/venues/${encodeURIComponent(id)}?_owner=true&_bookings=true`,
    { signal }
  )
  return res.data
}

/**
 * Creates a venue. Venue managers only
 */
export async function createVenue(data: VenueData, token: string): Promise<Venue> {
  const res = await apiFetch<ApiResponse<Venue>>('/holidaze/venues', {
    method: 'POST',
    body: data,
    token,
  })
  return res.data
}

/**
 * Updates a venue. Only the owner can do this
 */
export async function updateVenue(
  id: string,
  data: Partial<VenueData>,
  token: string
): Promise<Venue> {
  const res = await apiFetch<ApiResponse<Venue>>(`/holidaze/venues/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: data,
    token,
  })
  return res.data
}

/**
 * Deletes a venue. Only the owner can do this. The API answers 204 (no body)
 */
export function deleteVenue(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/holidaze/venues/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    token,
  })
}
