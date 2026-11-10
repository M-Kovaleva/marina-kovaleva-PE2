import { useParams } from 'react-router-dom'
import { MapPin, Star, Users } from 'lucide-react'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import VenueAmenities from '../components/VenueAmenities'
import VenueGallery from '../components/VenueGallery'
import { useVenue } from '../hooks/useVenue'
import { formatPlace, formatPrice } from '../utils/format'
import styles from './VenuePage.module.css'

function VenuePage() {
  const { id = '' } = useParams()
  const { venue, isLoading, error, retry } = useVenue(id)

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Loader label="Loading venue…" />
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className={styles.page}>
        <ErrorMessage
          message={error ?? 'Venue not found.'}
          onRetry={retry}
          backTo={{ to: '/', label: 'Back to all venues' }}
        />
      </div>
    )
  }

  const { name, description, media, price, maxGuests, rating, meta, location } = venue
  const place = formatPlace(location)

  return (
    <div className={styles.page}>
      <title>{`${name} · Holidaze`}</title>
      <VenueGallery media={media} name={name} />

      <div className={styles.layout}>
        <div className={styles.content}>
          <section className={styles.header}>
            <h1 className={styles.title}>{name}</h1>
            <ul className={styles.facts}>
              <li>
                <MapPin size={18} aria-hidden="true" />
                {place || 'Location not added'}
              </li>
              <li>
                {rating > 0 ? (
                  <span
                    className={styles.rating}
                    role="img"
                    aria-label={`Rated ${rating.toFixed(1)} out of 5`}
                  >
                    <Star size={18} aria-hidden="true" />
                    {rating.toFixed(1)}
                  </span>
                ) : (
                  <span className={styles.new}>New</span>
                )}
              </li>
              <li>
                <Users size={18} aria-hidden="true" />
                Up to {maxGuests} {maxGuests === 1 ? 'guest' : 'guests'}
              </li>
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="about-heading">
            <h2 id="about-heading" className={styles.heading}>
              About this place
            </h2>
            <p className={styles.description}>{description || 'No description yet.'}</p>
          </section>

          <section className={styles.section} aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className={styles.heading}>
              Amenities
            </h2>
            <VenueAmenities meta={meta} />
          </section>
        </div>

        {/* Becomes the booking card in Sprint 4 */}
        <aside className={styles.card} aria-label="Price">
          <p className={styles.price}>
            <strong>{formatPrice(price)}</strong> / night
          </p>
        </aside>
      </div>
    </div>
  )
}

export default VenuePage