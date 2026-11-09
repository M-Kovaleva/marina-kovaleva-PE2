import { apiFetch } from './apiFetch'
import type { ApiListResponse, ApiResponse } from '../types/api'
import type { Booking } from '../types/booking'
import type { Profile } from '../types/profile'
import type { Media, Venue } from '../types/venue'

const profilePath = (name: string) => `/holidaze/profiles/${encodeURIComponent(name)}`

/**
 * Gets the bookings a customer made, with the venue, nearest date first
 */
export async function getProfileBookings(
  name: string,
  token: string,
  signal?: AbortSignal
): Promise<Booking[]> {
  const res = await apiFetch<ApiListResponse<Booking>>(
    `${profilePath(name)}/bookings?_venue=true&sort=dateFrom&sortOrder=asc`,
    { token, signal }
  )
  return res.data
}

/**
 * Gets the venues a venue manager owns, with their bookings and customers
 */
export async function getProfileVenues(
  name: string,
  token: string,
  signal?: AbortSignal
): Promise<Venue[]> {
  const res = await apiFetch<ApiListResponse<Venue>>(`${profilePath(name)}/venues?_bookings=true`, {
    token,
    signal,
  })
  return res.data
}

/**
 * Changes the avatar. The API checks that the image URL is public (400 if not)
 */
export async function updateAvatar(name: string, avatar: Media, token: string): Promise<Profile> {
  const res = await apiFetch<ApiResponse<Profile>>(profilePath(name), {
    method: 'PUT',
    body: { avatar },
    token,
  })
  return res.data
}
