import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import { fromDateInputValue, startOfToday, toDateInputValue } from '../utils/dates'
import { isRangeFree } from '../utils/availability'
import styles from './VenueCalendar.module.css'

interface VenueCalendarProps {
  /** Booked nights as "YYYY-MM-DD" (from getBookedNights) */
  bookedNights: string[]
  /** Without range and onChange the calendar only shows availability (venue managers) */
  range?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

/**
 * Month calendar for choosing check-in and check-out
 * Past days and booked nights are greyed out and cannot be clicked
 * A stay cannot jump over a booking: then the click starts a new stay instead
 */
function VenueCalendar({ bookedNights, range, onChange }: VenueCalendarProps) {
  const today = startOfToday()
  const booked = bookedNights.map((night) => fromDateInputValue(night) as Date)
  const choosingCheckOut = Boolean(range?.from && !range.to)

  // While choosing check-out, the first booked night after check-in can be the check-out day
  // (we leave in the morning, the next guest arrives later that day)
  const fromKey = range?.from ? toDateInputValue(range.from) : ''
  const checkOutOnly = choosingCheckOut ? bookedNights.find((night) => night > fromKey) : undefined
  const disabled = [
    { before: today },
    ...booked.filter((night) => toDateInputValue(night) !== checkOutOnly),
  ]

  function handleSelect(_: DateRange | undefined, day: Date) {
    if (!onChange) return
    const from = range?.from
    if (choosingCheckOut && from && day > from && isRangeFree(from, day, bookedNights)) {
      onChange({ from, to: day })
    } else if (!bookedNights.includes(toDateInputValue(day))) {
      onChange({ from: day, to: undefined })
    }
  }

  return (
    <div className={styles.calendar}>
      {onChange ? (
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={disabled}
          modifiers={{ booked }}
          modifiersClassNames={{ booked: styles.booked }}
          defaultMonth={range?.from ?? today}
          startMonth={today}
          weekStartsOn={1}
        />
      ) : (
        <DayPicker
          disabled={disabled}
          modifiers={{ booked }}
          modifiersClassNames={{ booked: styles.booked }}
          startMonth={today}
          weekStartsOn={1}
        />
      )}

      <ul className={styles.legend} aria-label="Legend">
        <li>
          <span className={`${styles.swatch} ${styles.free}`} aria-hidden="true" />
          Available
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.taken}`} aria-hidden="true" />
          Booked
        </li>
        {onChange && (
          <li>
            <span className={`${styles.swatch} ${styles.chosen}`} aria-hidden="true" />
            Your stay
          </li>
        )}
      </ul>
    </div>
  )
}

export default VenueCalendar