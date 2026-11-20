import { useState } from 'react'
import { Trash2, TriangleAlert } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { deleteVenue } from '../services/venues'
import { getUpcoming } from '../utils/bookings'
import type { Venue } from '../types/venue'
import buttons from '../styles/buttons.module.css'
import forms from '../styles/forms.module.css'
import styles from './DeleteVenue.module.css'

interface DeleteVenueProps {
  venue: Venue
  onDeleted: () => void
  onCancel: () => void
}

/** Content of the "Delete venue?" modal: what will be removed, Cancel and Delete venue */
function DeleteVenue({ venue, onDeleted, onCancel }: DeleteVenueProps) {
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [apiError, setApiError] = useState('')
  const upcoming = getUpcoming(venue.bookings ?? []).length

  let message = 'The venue will be removed.'
  if (upcoming > 0) {
    message = `The venue and its ${upcoming} upcoming ${upcoming === 1 ? 'booking' : 'bookings'} will be removed.`
  }

  async function handleDelete() {
    if (!user) return
    setIsDeleting(true)
    setApiError('')
    try {
      await deleteVenue(venue.id, user.accessToken)
      onDeleted()
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Something went wrong.')
      setIsDeleting(false)
    }
  }

  return (
    <div className={styles.body}>
      <p className={styles.name}>{venue.name}</p>
      <p className={styles.message}>{message} This can’t be undone.</p>

      {apiError && (
        <p className={forms.alert} role="alert">
          <TriangleAlert size={18} aria-hidden="true" />
          {apiError}
        </p>
      )}

      <div className={styles.actions}>
        <button type="button" className={buttons.secondary} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={buttons.danger}
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash2 size={18} aria-hidden="true" />
          {isDeleting ? 'Deleting…' : 'Delete venue'}
        </button>
      </div>
    </div>
  )
}

export default DeleteVenue
