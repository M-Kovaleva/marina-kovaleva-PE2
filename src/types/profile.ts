import type { Booking } from './booking'
import type { Media, Venue } from './venue'

/**
 * A user profile from `/holidaze/profiles`
 * `venues` and `bookings` come only with `?_venues=true` / `?_bookings=true`
 */
export interface Profile {
  name: string
  email: string
  bio?: string | null
  avatar?: Media
  banner?: Media
  venueManager?: boolean
  _count?: {
    venues: number
    bookings: number
  }
  venues?: Venue[]
  bookings?: Booking[]
}
