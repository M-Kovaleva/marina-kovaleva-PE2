import { Link } from 'react-router-dom'
import { CalendarDays, ChevronDown, Search } from 'lucide-react'
import BookingCard from './BookingCard'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import { useMyBookings } from '../hooks/useMyBookings'
import { getPast, getUpcoming } from '../utils/bookings'
import buttons from '../styles/buttons.module.css'
import lists from '../styles/profileList.module.css'
import styles from './MyBookings.module.css'

interface MyBookingsProps {
  name: string
  token: string
}

/**
 * "My bookings": stays that have not ended yet, nearest first.
 * Past stays are under them in a closed "Past stays" block, newest first
 */
function MyBookings({ name, token }: MyBookingsProps) {
  const { bookings, isLoading, error, retry } = useMyBookings(name, token)
  const upcoming = getUpcoming(bookings)
  const past = getPast(bookings)

  return (
    <section aria-labelledby="bookings-heading">
      <h2 id="bookings-heading" className={lists.heading}>
        My bookings
        {upcoming.length > 0 && <span className={lists.count}>{upcoming.length}</span>}
      </h2>
      <p className={lists.subtitle}>Upcoming stays, nearest first.</p>

      {isLoading && <Loader label="Loading your bookings…" />}
      {!isLoading && error && <ErrorMessage message={error} onRetry={retry} />}

      {!isLoading && !error && upcoming.length === 0 && (
        <div className={lists.empty}>
          <CalendarDays size={32} aria-hidden="true" />
          <p className={lists.emptyTitle}>No upcoming bookings</p>
          <p>When you book a stay, it will show up here.</p>
          <Link to="/" className={buttons.primary}>
            <Search size={18} aria-hidden="true" />
            Find a stay
          </Link>
        </div>
      )}

      {!isLoading && upcoming.length > 0 && (
        <ul className={lists.list}>
          {upcoming.map((booking) => (
            <li key={booking.id}>
              <BookingCard booking={booking} />
            </li>
          ))}
        </ul>
      )}

      {/* <details> opens and closes by itself, also with Enter / Space */}
      {!isLoading && past.length > 0 && (
        <details className={styles.past}>
          <summary className={styles.summary}>
            Past stays
            <span className={lists.count}>{past.length}</span>
            <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
          </summary>
          <ul className={lists.list}>
            {past.map((booking) => (
              <li key={booking.id}>
                <BookingCard booking={booking} isPast />
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}

export default MyBookings
