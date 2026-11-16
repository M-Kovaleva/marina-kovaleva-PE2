import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'
import { CircleCheck, Info, Minus, Plus, TriangleAlert } from 'lucide-react'
import VenueCalendar from './VenueCalendar'
import { useAuth } from '../hooks/useAuth'
import { createBooking } from '../services/bookings'
import { getBookedNights, isRangeFree } from '../utils/availability'
import { countNights, fromDateInputValue, startOfToday, toDateInputValue } from '../utils/dates'
import { formatDate, formatPrice } from '../utils/format'
import type { Booking } from '../types/booking'
import type { Venue } from '../types/venue'
import buttons from '../styles/buttons.module.css'
import forms from '../styles/forms.module.css'
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

/** Guests from the search (?guests=), kept between 1 and the venue maximum */
function getStartGuests(guests: string | null, maxGuests: number) {
  const count = Number(guests) || 1
  return Math.min(Math.max(Math.round(count), 1), maxGuests)
}

/**
 * "Book your stay": calendar, guests, total price and Book now.
 * Visitors see "Log in to book"; the chosen dates stay while the login modal is open
 */
function BookingPanel({ venue }: BookingPanelProps) {
  const { user, isManager, openAuth } = useAuth()
  const [searchParams] = useSearchParams()
  // Bookings made here are added at once, so the calendar shows them without reloading
  const [newBookings, setNewBookings] = useState<Booking[]>([])
  const bookedNights = getBookedNights([...(venue.bookings ?? []), ...newBookings])

  const [range, setRange] = useState<DateRange | undefined>(() =>
    getStartRange(searchParams.get('from'), searchParams.get('to'), bookedNights)
  )
  const [guests, setGuests] = useState(() =>
    getStartGuests(searchParams.get('guests'), venue.maxGuests)
  )
  const [isSending, setIsSending] = useState(false)
  const [apiError, setApiError] = useState('')
  const [created, setCreated] = useState<Booking | null>(null)

  const nights = range?.from && range.to ? countNights(range.from, range.to) : 0
  const total = nights * venue.price

  let status = 'Select your check-in date'
  if (range?.from && !range.to) status = 'Select your check-out date'
  if (range?.from && range.to) {
    status = `${formatDate(range.from)} – ${formatDate(range.to)} · ${nights} ${nights === 1 ? 'night' : 'nights'}`
  }

  function handleRangeChange(next: DateRange | undefined) {
    setRange(next)
    setApiError('')
    setCreated(null)
  }

  async function handleBook() {
    if (!user || !range?.from || !range.to) return
    setIsSending(true)
    setApiError('')
    try {
      const booking = await createBooking(
        {
          dateFrom: toDateInputValue(range.from),
          dateTo: toDateInputValue(range.to),
          guests,
          venueId: venue.id,
        },
        user.accessToken
      )
      setNewBookings((list) => [...list, booking])
      setCreated(booking)
      setRange(undefined)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Something went wrong.')
    }
    setIsSending(false)
  }

  // Venue managers cannot book: they see the availability only
  if (isManager) {
    const isOwner = venue.owner?.name === user?.name
    return (
      <aside className={styles.panel} aria-labelledby="booking-heading">
        <p className={styles.price}>
          <strong>{formatPrice(venue.price)}</strong> / night
        </p>
        <h2 id="booking-heading" className={styles.heading}>
          Availability
        </h2>
        <p className={styles.hint}>Booked dates are crossed out.</p>
        <VenueCalendar bookedNights={bookedNights} />
        <p className={styles.info}>
          <Info size={18} aria-hidden="true" />
          {isOwner ? 'This is your venue.' : 'Booking is available for customer accounts only.'}
        </p>
      </aside>
    )
  }

  return (
    <aside className={styles.panel} aria-labelledby="booking-heading">
      <p className={styles.price}>
        <strong>{formatPrice(venue.price)}</strong> / night
      </p>
      <h2 id="booking-heading" className={styles.heading}>
        Book your stay
      </h2>

      {created && (
        <div className={styles.success} role="status">
          <p className={styles.successTitle}>
            <CircleCheck size={20} aria-hidden="true" />
            Booking created!
          </p>
          <p>
            {formatDate(new Date(created.dateFrom))} – {formatDate(new Date(created.dateTo))} ·{' '}
            {created.guests} {created.guests === 1 ? 'guest' : 'guests'}
          </p>
          <Link to="/profile" className={styles.successLink}>
            Go to my bookings
          </Link>
        </div>
      )}

      <dl className={styles.dates}>
        <div>
          <dt>Check-in</dt>
          <dd>{range?.from ? formatDate(range.from) : 'Add date'}</dd>
        </div>
        <div>
          <dt>Check-out</dt>
          <dd>{range?.to ? formatDate(range.to) : 'Add date'}</dd>
        </div>
      </dl>

      <div className={styles.status}>
        <p aria-live="polite">{status}</p>
        {range && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => handleRangeChange(undefined)}
          >
            Clear dates
          </button>
        )}
      </div>

      <VenueCalendar bookedNights={bookedNights} range={range} onChange={handleRangeChange} />

      <div className={styles.guests}>
        <div>
          <p className={styles.label} id="guests-label">
            Guests
          </p>
          <p className={styles.hint}>Maximum {venue.maxGuests} guests</p>
        </div>
        <div className={styles.stepper} role="group" aria-labelledby="guests-label">
          <button
            type="button"
            className={styles.step}
            aria-label="Fewer guests"
            disabled={guests <= 1}
            onClick={() => setGuests(guests - 1)}
          >
            <Minus size={18} aria-hidden="true" />
          </button>
          <output aria-live="polite">
            {guests} {guests === 1 ? 'guest' : 'guests'}
          </output>
          <button
            type="button"
            className={styles.step}
            aria-label="More guests"
            disabled={guests >= venue.maxGuests}
            onClick={() => setGuests(guests + 1)}
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {nights > 0 ? (
        <dl className={styles.total}>
          <div>
            <dt>
              {nights} {nights === 1 ? 'night' : 'nights'} × {formatPrice(venue.price)}
            </dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className={styles.totalRow}>
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      ) : (
        <p className={styles.hint}>Choose dates to see the total price.</p>
      )}

      {apiError && (
        <p className={forms.alert} role="alert">
          <TriangleAlert size={18} aria-hidden="true" />
          {apiError}
        </p>
      )}

      {user ? (
        <button
          type="button"
          className={`${buttons.primary} ${styles.book}`}
          disabled={nights < 1 || isSending}
          onClick={handleBook}
        >
          {isSending ? 'Booking…' : 'Book now'}
        </button>
      ) : (
        <>
          <button
            type="button"
            className={`${buttons.primary} ${styles.book}`}
            onClick={() => openAuth('login')}
          >
            Log in to book
          </button>
          <p className={styles.hint}>Your dates are kept after you log in.</p>
        </>
      )}
    </aside>
  )
}

export default BookingPanel