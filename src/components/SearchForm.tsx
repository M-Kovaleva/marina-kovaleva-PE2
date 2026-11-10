import { useState, type SubmitEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Search, Users } from 'lucide-react'
import { toDateInputValue } from '../utils/dates'
import buttons from '../styles/buttons.module.css'
import styles from './SearchForm.module.css'

const MAX_GUESTS = 100

interface SearchErrors {
  from?: string
  to?: string
  guests?: string
}

/** Checks the dates and the number of guests. Dates are "YYYY-MM-DD", so they compare as text */
function validate(from: string, to: string, guests: string, today: string): SearchErrors {
  const errors: SearchErrors = {}
  const count = Number(guests)

  if (from && from < today) errors.from = 'Check-in can’t be in the past'
  if (!from && to) errors.from = 'Choose a check-in date'
  if (from && !to) errors.to = 'Choose a check-out date'
  if (from && to && to <= from) errors.to = 'Check-out must be after check-in'
  if (!Number.isInteger(count) || count < 1) errors.guests = 'At least 1 guest'
  else if (count > MAX_GUESTS) errors.guests = `Up to ${MAX_GUESTS} guests`

  return errors
}

/**
 * Search block: Where, Check-in, Check-out, Guests, Find a stay
 * Reads its start values from the URL and saves the search back to the URL
 */
function SearchForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [where, setWhere] = useState(searchParams.get('q') ?? '')
  const [from, setFrom] = useState(searchParams.get('from') ?? '')
  const [to, setTo] = useState(searchParams.get('to') ?? '')
  const [guests, setGuests] = useState(searchParams.get('guests') ?? '1')
  const [errors, setErrors] = useState<SearchErrors>({})
  const today = toDateInputValue(new Date())

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

      <div className={styles.field}>
        <label htmlFor="search-from">Check-in</label>
        <input
          id="search-from"
          type="date"
          value={from}
          min={today}
          onChange={(event) => {
            setFrom(event.target.value)
            setErrors((prev) => ({ ...prev, from: undefined }))
          }}
          aria-invalid={Boolean(errors.from)}
          aria-describedby={errors.from ? 'search-from-error' : undefined}
        />
        {errors.from && (
          <p id="search-from-error" className={styles.error}>
            {errors.from}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="search-to">Check-out</label>
        <input
          id="search-to"
          type="date"
          value={to}
          min={from || today}
          onChange={(event) => {
            setTo(event.target.value)
            setErrors((prev) => ({ ...prev, to: undefined }))
          }}
          aria-invalid={Boolean(errors.to)}
          aria-describedby={errors.to ? 'search-to-error' : undefined}
        />
        {errors.to && (
          <p id="search-to-error" className={styles.error}>
            {errors.to}
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
    </form>
  )
}

export default SearchForm
