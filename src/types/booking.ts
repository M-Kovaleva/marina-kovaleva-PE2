import type { Profile } from './profile'
import type { Venue } from './venue'

/**
 * A booking from `/holidaze/bookings`
 * Dates are ISO strings, e.g. "2026-11-14T00:00:00.000Z"
 * `venue` comes only with `?_venue=true`, `customer` only with `?_customer=true`
 */
export interface Booking {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
  created: string
  updated: string
  venue?: Venue
  customer?: Profile
}
