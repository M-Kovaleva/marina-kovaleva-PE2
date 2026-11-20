import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Moon, Pencil, Trash2, Users } from 'lucide-react'
import Avatar from './Avatar'
import VenueImage from './VenueImage'
import { getStayBadge, getUpcoming } from '../utils/bookings'
import { countNights } from '../utils/dates'
import { formatDateRange, formatPlace, formatPrice } from '../utils/format'
import type { Venue } from '../types/venue'
import buttons from '../styles/buttons.module.css'
import styles from './MyVenueCard.module.css'

interface MyVenueCardProps {
  venue: Venue
  onEdit: () => void
  onDelete: () => void
}

/** One venue of the manager with its upcoming bookings: dates, guests and who booked */
function MyVenueCard({ venue, onEdit, onDelete }: MyVenueCardProps) {
  const upcoming = getUpcoming(venue.bookings ?? [])
  const place = formatPlace(venue.location)

  return (
    <article className={styles.card}>
      <div className={styles.venue}>
        <VenueImage media={venue.media[0]} fallbackAlt={venue.name} className={styles.image} />
        <div className={styles.info}>
          <h3 className={styles.title}>
            <Link to={`/venues/${venue.id}`} className={styles.link}>
              {venue.name}
            </Link>
          </h3>
          {place && (
            <p className={`${styles.meta} ${styles.icon}`}>
              <MapPin size={16} aria-hidden="true" />
              {place}
            </p>
          )}
          <p className={styles.meta}>
            <span>
              <strong className={styles.price}>{formatPrice(venue.price)}</strong> / night
            </span>
            <span className={styles.icon}>
              <Users size={16} aria-hidden="true" />
              Up to {venue.maxGuests} {venue.maxGuests === 1 ? 'guest' : 'guests'}
            </span>
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={buttons.secondary} onClick={onEdit}>
            <Pencil size={18} aria-hidden="true" />
            Edit
          </button>
          <button type="button" className={buttons.dangerOutline} onClick={onDelete}>
            <Trash2 size={18} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      <h4 className={styles.subheading}>Upcoming bookings ({upcoming.length})</h4>

      {upcoming.length === 0 ? (
        <p className={styles.none}>
          <Moon size={18} aria-hidden="true" />
          No upcoming bookings
        </p>
      ) : (
        <ul className={styles.bookings}>
          {upcoming.map((booking) => {
            const from = new Date(booking.dateFrom)
            const to = new Date(booking.dateTo)
            const nights = countNights(from, to)
            return (
              <li key={booking.id} className={styles.booking}>
                <p className={styles.dates}>
                  <CalendarDays size={18} aria-hidden="true" />
                  {formatDateRange(from, to)} · {nights} {nights === 1 ? 'night' : 'nights'}
                </p>
                <div className={styles.people}>
                  <p className={styles.icon}>
                    <Users size={16} aria-hidden="true" />
                    {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                  </p>
                  {booking.customer && (
                    <p className={styles.customer}>
                      <Avatar name={booking.customer.name} url={booking.customer.avatar?.url} />
                      {booking.customer.name}
                    </p>
                  )}
                </div>
                <p className={styles.badge}>
                  <CalendarDays size={14} aria-hidden="true" />
                  {getStayBadge(from)}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}

export default MyVenueCard
