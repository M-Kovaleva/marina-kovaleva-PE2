import { countNights, startOfToday, toDateInputValue } from './dates'
import type { Booking } from '../types/booking'
import { plural } from './format'

/**
 * Stays that have not ended yet, nearest first
 * A stay has ended on its check-out day
 */
export function getUpcoming(bookings: Booking[]): Booking[] {
  const today = toDateInputValue(startOfToday())
  return bookings
    .filter((booking) => toDateInputValue(new Date(booking.dateTo)) > today)
    .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
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
