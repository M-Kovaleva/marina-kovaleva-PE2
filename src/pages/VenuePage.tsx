import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, MapPin, Pencil, Trash2, Users } from 'lucide-react'
import DeleteVenue from '../components/DeleteVenue'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import VenueAmenities from '../components/VenueAmenities'
import VenueForm from '../components/VenueForm'
import VenueGallery from '../components/VenueGallery'
import { useVenue } from '../hooks/useVenue'
import { formatPlace, plural } from '../utils/format'
import buttons from '../styles/buttons.module.css'
import styles from './VenuePage.module.css'
import ErrorScreen from '../components/ErrorScreen'
import BookingPanel from '../components/BookingPanel'
import RatingBadge from '../components/RatingBadge'

function VenuePage() {
  const { id = '' } = useParams()
  const { venue, isLoading, error, notFound, retry } = useVenue(id)
  const location = useLocation()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Came here from the venue list (the card link sets this state)
  const cameFromList = (location.state as { fromList?: boolean } | null)?.fromList === true

  // A new page starts at the top, not where the list was scrolled to
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  /** Back to the same list and search: browser history if we came from it, else the home page */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    if (!cameFromList) return
    event.preventDefault()
    navigate(-1)
  }

  // After Edit the venue reloads; the old data stays on the screen meanwhile (no loader flash)
  if (isLoading && venue?.id !== id) {
    return (
      <div className={styles.page}>
        <Loader label="Loading venue…" />
      </div>
    )
  }

  if (notFound) {
    return (
      <ErrorScreen
        title="We couldn’t find this venue"
        message="The link may be wrong, or the venue was removed by its owner."
        link={{ to: '/', label: 'Back to all venues' }}
      />
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

  const { name, description, media, maxGuests, rating, meta } = venue
  const place = formatPlace(venue.location)

  return (
    <div className={styles.page}>
      <title>{`${name} | Holidaze`}</title>
      <Link
        to={{ pathname: '/', search: location.search }}
        className={styles.back}
        onClick={handleBack}
      >
        <ChevronLeft size={18} aria-hidden="true" />
        Back to venues
      </Link>
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
                <RatingBadge rating={rating} />
              </li>
              <li>
                <Users size={18} aria-hidden="true" />
                Up to {plural(maxGuests, 'guest')}
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

        <BookingPanel
          venue={venue}
          ownerActions={
            <>
              <button
                type="button"
                className={buttons.secondary}
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={18} aria-hidden="true" />
                Edit venue
              </button>
              <button
                type="button"
                className={buttons.dangerOutline}
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 size={18} aria-hidden="true" />
                Delete
              </button>
            </>
          }
        />
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit venue"
        description="Fields marked * are required."
        size="wide"
      >
        <VenueForm
          venue={venue}
          onSaved={() => {
            setIsEditing(false)
            retry()
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete venue?"
        size="small"
      >
        {/* The venue page is gone after this, so go to the profile (replace: Back does not return here) */}
        <DeleteVenue
          venue={venue}
          onDeleted={() => navigate('/profile', { replace: true })}
          onCancel={() => setIsDeleting(false)}
        />
      </Modal>
    </div>
  )
}

export default VenuePage
