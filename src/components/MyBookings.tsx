import { Link } from 'react-router-dom'
import { CalendarDays, Search } from 'lucide-react'
import BookingCard from './BookingCard'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import { useMyBookings } from '../hooks/useMyBookings'
import { startOfToday, toDateInputValue } from '../utils/dates'
import buttons from '../styles/buttons.module.css'
import styles from './MyBookings.module.css'

interface MyBookingsProps {
  name: string
  token: string
}

/**
 * "My bookings": stays that have not ended yet, nearest first
 * A stay has ended on its check-out day
 */
function MyBookings({ name, token }: MyBookingsProps) {
  const { bookings, isLoading, error, retry } = useMyBookings(name, token)
  const today = toDateInputValue(startOfToday())
  const upcoming = bookings
    .filter((booking) => toDateInputValue(new Date(booking.dateTo)) > today)
    .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))

  return (
    <section aria-labelledby="bookings-heading">
      <h2 id="bookings-heading" className={styles.heading}>
        My bookings
        {upcoming.length > 0 && <span className={styles.count}>{upcoming.length}</span>}
      </h2>
      <p className={styles.subtitle}>Upcoming stays, nearest first.</p>

      {isLoading && <Loader label="Loading your bookings…" />}
      {!isLoading && error && <ErrorMessage message={error} onRetry={retry} />}

      {!isLoading && !error && upcoming.length === 0 && (
        <div className={styles.empty}>
          <CalendarDays size={32} aria-hidden="true" />
          <p className={styles.emptyTitle}>No upcoming bookings</p>
          <p>When you book a stay, it will show up here.</p>
          <Link to="/" className={buttons.primary}>
            <Search size={18} aria-hidden="true" />
            Find a stay
          </Link>
        </div>
      )}

      {!isLoading && upcoming.length > 0 && (
        <ul className={styles.list}>
          {upcoming.map((booking) => (
            <li key={booking.id}>
              <BookingCard booking={booking} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MyBookings
