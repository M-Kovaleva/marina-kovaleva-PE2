import { countNights, startOfToday, toDateInputValue } from './dates'
import { plural } from './format'
import type { Booking } from '../types/booking'

/** Check-out day of a booking as "YYYY-MM-DD" in local time */
function checkOutDay(booking: Booking): string {
  return toDateInputValue(new Date(booking.dateTo))
}

/**
 * Stays that have not ended yet, nearest first
 * A stay has ended on its check-out day
 */
export function getUpcoming(bookings: Booking[]): Booking[] {
  const today = toDateInputValue(startOfToday())
  return bookings
    .filter((booking) => checkOutDay(booking) > today)
    .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
}

/**
 * Stays that have ended (on the check-out day or earlier), newest first
 * Together with getUpcoming this covers every booking exactly once
 */
export function getPast(bookings: Booking[]): Booking[] {
  const today = toDateInputValue(startOfToday())
  return bookings
    .filter((booking) => checkOutDay(booking) <= today)
    .sort((a, b) => b.dateFrom.localeCompare(a.dateFrom))
}

/** "In 10 days", "Today" (check-in today) or "Now" (the stay has started) */
export function getStayBadge(from: Date): string {
  const today = toDateInputValue(startOfToday())
  const checkIn = toDateInputValue(from)
  if (checkIn === today) return 'Today'
  if (checkIn < today) return 'Now'
  const days = countNights(startOfToday(), from)
  return `In ${plural(days, 'day')}`
}
