import { addDays, toDateInputValue } from './dates'
import type { Booking } from '../types/booking'
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
/** True when the user chose dates or more than 1 guest, so the list must be filtered */
export function hasFilter({ from, to, guests }: StayFilter): boolean {
  return Boolean(from && to) || guests > 1
}

/**
 * Every booked night as "YYYY-MM-DD", sorted.
 * A booking 20–23 Nov books the nights of 20, 21 and 22; the check-out day (23) stays free
 */
export function getBookedNights(bookings: Booking[]): string[] {
  const nights = new Set<string>()
  for (const booking of bookings) {
    const checkOut = toDateInputValue(new Date(booking.dateTo))
    let night = new Date(booking.dateFrom)
    night = new Date(night.getFullYear(), night.getMonth(), night.getDate())
    while (toDateInputValue(night) < checkOut) {
      nights.add(toDateInputValue(night))
      night = addDays(night, 1)
    }
  }
  return [...nights].sort()
}

/** True when no night from check-in up to (not including) check-out is booked */
export function isRangeFree(from: Date, to: Date, bookedNights: string[]): boolean {
  const start = toDateInputValue(from)
  const end = toDateInputValue(to)
  return !bookedNights.some((night) => night >= start && night < end)
}
