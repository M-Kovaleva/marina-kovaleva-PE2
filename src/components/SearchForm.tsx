import { useState, type SubmitEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'
import { MapPin, Search, Users } from 'lucide-react'
import Modal from './Modal'
import VenueCalendar from './VenueCalendar'
import { countNights, fromDateInputValue, toDateInputValue } from '../utils/dates'
import { formatDate, plural } from '../utils/format'
import buttons from '../styles/buttons.module.css'
import dates from '../styles/dateRange.module.css'
import styles from './SearchForm.module.css'
import { MAX_GUESTS } from '../constants'

/** The search calendar has no booked nights: every day from today can be picked */
const NO_BOOKINGS: string[] = []

interface SearchErrors {
  dates?: string
  guests?: string
}

/** Checks the dates and the number of guests. Dates are "YYYY-MM-DD", so they compare as text */
function validate(from: string, to: string, guests: string, today: string): SearchErrors {
  const errors: SearchErrors = {}
  const count = Number(guests)

  // The calendar never lets check-out be before check-in. An old link can still hold a past date
  if (from && from < today) errors.dates = 'Check-in can’t be in the past'
  else if (from && !to) errors.dates = 'Choose a check-out date'
  if (!Number.isInteger(count) || count < 1) errors.guests = 'At least 1 guest'
  else if (count > MAX_GUESTS) errors.guests = `Up to ${MAX_GUESTS} guests`

  return errors
}

/**
 * Search block: Where, When (check-in and check-out in a calendar window), Guests, Find a stay
 * Reads its start values from the URL and saves the search back to the URL
 */
function SearchForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [where, setWhere] = useState(searchParams.get('q') ?? '')
  const [from, setFrom] = useState(searchParams.get('from') ?? '')
  const [to, setTo] = useState(searchParams.get('to') ?? '')
  const [guests, setGuests] = useState(searchParams.get('guests') ?? '1')
  const [errors, setErrors] = useState<SearchErrors>({})
  const [isPicking, setIsPicking] = useState(false)
  const today = toDateInputValue(new Date())

  const checkIn = fromDateInputValue(from)
  const checkOut = fromDateInputValue(to)
  const range: DateRange | undefined = checkIn ? { from: checkIn, to: checkOut } : undefined

  let status = 'Select your check-in date'
  if (checkIn && !checkOut) status = 'Select your check-out date'
  if (checkIn && checkOut) {
    status = `${formatDate(checkIn)} – ${formatDate(checkOut)}, ${plural(countNights(checkIn, checkOut), 'night')}`
  }

  function handleRangeChange(next: DateRange | undefined) {
    setFrom(next?.from ? toDateInputValue(next.from) : '')
    setTo(next?.to ? toDateInputValue(next.to) : '')
    setErrors((prev) => ({ ...prev, dates: undefined }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const found = validate(from, to, guests, today)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const params = new URLSearchParams()
    if (where.trim()) params.set('q', where.trim())
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (Number(guests) > 1) params.set('guests', guests)
    setSearchParams(params)
  }

  return (
    <form
      id="search"
      tabIndex={-1}
      className={styles.form}
      role="search"
      aria-label="Find a stay"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className={`${styles.field} ${styles.where}`}>
        <label htmlFor="search-where">Where</label>
        <div className={styles.inputWrap}>
          <MapPin size={20} aria-hidden="true" />
          <input
            id="search-where"
            type="search"
            placeholder="Where are you going?"
            value={where}
            onChange={(event) => setWhere(event.target.value)}
            maxLength={100}
          />
        </div>
      </div>

      {/* One button for both dates: it opens the same calendar as the venue page */}
      <div className={`${styles.field} ${styles.dates}`}>
        <span className={styles.label} aria-hidden="true">
          When
        </span>
        <button
          type="button"
          className={`${dates.range} ${styles.datesButton}`}
          aria-haspopup="dialog"
          aria-invalid={Boolean(errors.dates)}
          aria-describedby={errors.dates ? 'search-dates-error' : undefined}
          onClick={() => setIsPicking(true)}
        >
          <span className={dates.half}>
            <span className={dates.label}>Check-in</span>
            <span className={dates.value}>{checkIn ? formatDate(checkIn) : 'Add date'}</span>
          </span>
          <span className={dates.half}>
            <span className={dates.label}>Check-out</span>
            <span className={dates.value}>{checkOut ? formatDate(checkOut) : 'Add date'}</span>
          </span>
        </button>
        {errors.dates && (
          <p id="search-dates-error" className={styles.error}>
            {errors.dates}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="search-guests">Guests</label>
        <div className={styles.inputWrap}>
          <Users size={20} aria-hidden="true" />
          <input
            id="search-guests"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_GUESTS}
            value={guests}
            onChange={(event) => {
              setGuests(event.target.value)
              setErrors((prev) => ({ ...prev, guests: undefined }))
            }}
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? 'search-guests-error' : undefined}
          />
        </div>
        {errors.guests && (
          <p id="search-guests-error" className={styles.error}>
            {errors.guests}
          </p>
        )}
      </div>

      <button type="submit" className={`${buttons.primary} ${styles.submit}`}>
        <Search size={20} aria-hidden="true" />
        Find a stay
      </button>

      <Modal
        isOpen={isPicking}
        onClose={() => setIsPicking(false)}
        title="When are you going?"
        size="small"
      >
        <VenueCalendar
          bookedNights={NO_BOOKINGS}
          range={range}
          onChange={handleRangeChange}
          showLegend={false}
        />
        <p className={styles.status} aria-live="polite">
          {status}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={buttons.secondary}
            onClick={() => handleRangeChange(undefined)}
            disabled={!range}
          >
            Clear
          </button>
          <button type="button" className={buttons.primary} onClick={() => setIsPicking(false)}>
            Done
          </button>
        </div>
      </Modal>
    </form>
  )
}

export default SearchForm
