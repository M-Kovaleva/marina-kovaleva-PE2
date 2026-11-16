import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'
import VenueCalendar from './VenueCalendar'
import { getBookedNights, isRangeFree } from '../utils/availability'
import { countNights, fromDateInputValue, startOfToday } from '../utils/dates'
import { formatDate, formatPrice } from '../utils/format'
import type { Venue } from '../types/venue'
import styles from './BookingPanel.module.css'

interface BookingPanelProps {
  venue: Venue
}

/** Dates from the search (?from=&to=), if they are in the future and free at this venue */
function getStartRange(from: string | null, to: string | null, bookedNights: string[]) {
  const checkIn = fromDateInputValue(from)
  const checkOut = fromDateInputValue(to)
  if (!checkIn || !checkOut || checkIn < startOfToday() || checkOut <= checkIn) return undefined
  return isRangeFree(checkIn, checkOut, bookedNights) ? { from: checkIn, to: checkOut } : undefined
}

/**
 * Price + calendar with the chosen stay
 * Starts with the dates from the search, when they are free here
 */
function BookingPanel({ venue }: BookingPanelProps) {
  const [searchParams] = useSearchParams()
  const bookedNights = getBookedNights(venue.bookings ?? [])
  const [range, setRange] = useState<DateRange | undefined>(() =>
    getStartRange(searchParams.get('from'), searchParams.get('to'), bookedNights)
  )

  const nights = range?.from && range.to ? countNights(range.from, range.to) : 0

  let status = 'Choose your check-in date'
  if (range?.from && !range.to) status = 'Now choose your check-out date'
  if (nights > 0) status = `${nights} ${nights === 1 ? 'night' : 'nights'}`

  return (
    <aside className={styles.panel} aria-label="Book your stay">
      <p className={styles.price}>
        <strong>{formatPrice(venue.price)}</strong> / night
      </p>

      <VenueCalendar bookedNights={bookedNights} range={range} onChange={setRange} />

      <dl className={styles.dates}>
        <div>
          <dt>Check-in</dt>
          <dd>{range?.from ? formatDate(range.from) : '—'}</dd>
        </div>
        <div>
          <dt>Check-out</dt>
          <dd>{range?.to ? formatDate(range.to) : '—'}</dd>
        </div>
      </dl>

      <div className={styles.status}>
        <p aria-live="polite">{status}</p>
        {range && (
          <button type="button" className={styles.clear} onClick={() => setRange(undefined)}>
            Clear dates
          </button>
        )}
      </div>
    </aside>
  )
}

export default BookingPanel