import { Link } from 'react-router-dom'
import { MapPin, Star, Users } from 'lucide-react'
import VenueImage from './VenueImage'
import type { Venue, VenueMeta } from '../types/venue'
import styles from './VenueCard.module.css'

const AMENITIES: { key: keyof VenueMeta; label: string }[] = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'parking', label: 'Parking' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'pets', label: 'Pets' },
]

const priceFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

interface VenueCardProps {
  venue: Venue
  /** Search params for the venue page link, e.g. "from=2026-11-14&to=2026-11-17&guests=2" */
  search?: string
}

/**
 * Card in the venue list. The whole card is a link to the venue page
 */
function VenueCard({ venue, search = '' }: VenueCardProps) {
  const { id, name, media, price, maxGuests, rating, meta, location } = venue
  const place = [location.city, location.country].filter(Boolean).join(', ')
  const amenities = AMENITIES.filter((amenity) => meta[amenity.key])

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <VenueImage media={media[0]} fallbackAlt={name} />
        <span className={styles.guests}>
          <Users size={14} aria-hidden="true" />
          Up to {maxGuests} {maxGuests === 1 ? 'guest' : 'guests'}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            <Link to={{ pathname: `/venues/${id}`, search }} className={styles.link}>
              {name}
            </Link>
          </h3>
          {rating > 0 ? (
            <span className={styles.rating} aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
              <Star size={16} aria-hidden="true" />
              {rating.toFixed(1)}
            </span>
          ) : (
            <span className={styles.new}>New</span>
          )}
        </div>

        <p className={styles.location}>
          <MapPin size={16} aria-hidden="true" />
          {place || 'Location not added'}
        </p>

        {amenities.length > 0 && (
          <ul className={styles.tags} aria-label="Amenities">
            {amenities.map((amenity) => (
              <li key={amenity.key} className={styles.tag}>
                {amenity.label}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.price}>
          <strong>{priceFormat.format(price)}</strong> / night
        </p>
      </div>
    </article>
  )
}

export default VenueCard
