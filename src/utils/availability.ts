import { toDateInputValue } from './dates'
import type { Venue } from '../types/venue'

/** What the user searched for: dates as "YYYY-MM-DD" (or empty) and number of guests */
export interface StayFilter {
  from: string
  to: string
  guests: number
}

/**
 * True when the venue fits the guests and has no booking on the chosen nights
 * The check-out day of a booking is free, so a new stay can start on it
 */
export function isAvailable(venue: Venue, { from, to, guests }: StayFilter): boolean {
  if (venue.maxGuests < guests) return false
  if (!from || !to) return true

  const bookings = venue.bookings ?? []
  return !bookings.some((booking) => {
    const bookedFrom = toDateInputValue(new Date(booking.dateFrom))
    const bookedTo = toDateInputValue(new Date(booking.dateTo))
    return from < bookedTo && bookedFrom < to
  })
}