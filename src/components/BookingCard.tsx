import { Link } from 'react-router-dom'
import { CalendarDays, ChevronRight, MapPin, Users } from 'lucide-react'
import VenueImage from './VenueImage'
import { getStayBadge } from '../utils/bookings'
import { countNights } from '../utils/dates'
import { formatDateRange, formatPlace, formatPrice, plural } from '../utils/format'
import type { Booking } from '../types/booking'
import styles from './BookingCard.module.css'

interface BookingCardProps {
  booking: Booking
}

/** One upcoming stay. The whole card links to the venue page */
function BookingCard({ booking }: BookingCardProps) {
  const { venue, guests } = booking
  const from = new Date(booking.dateFrom)
  const to = new Date(booking.dateTo)
  const nights = countNights(from, to)

  return (
    <article className={styles.card}>
      <VenueImage
        media={venue?.media[0]}
        fallbackAlt={venue?.name ?? ''}
        className={styles.image}
      />

      <div className={styles.body}>
        <p className={styles.badge}>
          <CalendarDays size={14} aria-hidden="true" />
          {getStayBadge(from)}
        </p>
        <h3 className={styles.title}>
          {venue ? (
            <Link to={`/venues/${venue.id}`} className={styles.link}>
              {venue.name}
            </Link>
          ) : (
            'Venue no longer available'
          )}
        </h3>
        {venue && formatPlace(venue.location) && (
          <p className={styles.meta}>
            <MapPin size={16} aria-hidden="true" />
            {formatPlace(venue.location)}
          </p>
        )}
        <p className={styles.meta}>
          <CalendarDays size={16} aria-hidden="true" />
          <strong>
            {formatDateRange(from, to)} , {plural(nights, 'night')}
          </strong>
          <span className={styles.guests}>
            <Users size={16} aria-hidden="true" />
            {plural(guests, 'guest')}
          </span>
        </p>
      </div>

      {venue && (
        <p className={styles.total}>
          <strong>{formatPrice(nights * venue.price)}</strong>
          <span>total</span>
        </p>
      )}
      <ChevronRight size={20} aria-hidden="true" className={styles.arrow} />
    </article>
  )
}

export default BookingCard
