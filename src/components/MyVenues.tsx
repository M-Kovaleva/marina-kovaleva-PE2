import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { House, Plus } from 'lucide-react'
import DeleteVenue from './DeleteVenue'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import Modal from './Modal'
import MyVenueCard from './MyVenueCard'
import VenueForm from './VenueForm'
import { useMyVenues } from '../hooks/useMyVenues'
import { useToast } from '../hooks/useToast'
import type { Venue } from '../types/venue'
import buttons from '../styles/buttons.module.css'
import lists from '../styles/profileList.module.css'
import styles from './MyVenues.module.css'

interface MyVenuesProps {
  name: string
  token: string
}

/**
 * "My venues": the venues of a venue manager, each with its upcoming bookings
 * The Create / Edit venue form opens here. "?new=venue" in the address opens
 * the Create form too, so "List your venue" in the header can open it from any page
 */
function MyVenues({ name, token }: MyVenuesProps) {
  const { venues, isLoading, error, reload } = useMyVenues(name, token)
  const [searchParams, setSearchParams] = useSearchParams()
  const isCreating = searchParams.get('new') === 'venue'
  const [editing, setEditing] = useState<Venue | null>(null)
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState<Venue | null>(null)

  // replace: opening and closing the form does not add steps to the Back button
  function openCreate() {
    setSearchParams({ new: 'venue' }, { replace: true })
  }

  function closeForm() {
    setEditing(null)
    if (isCreating) setSearchParams({}, { replace: true })
  }

  function handleSaved() {
    // Read before closeForm() clears it: editing is set only for Edit
    showToast(editing ? 'Changes saved' : 'Venue created')
    closeForm()
    reload()
  }

  function handleDeleted() {
    setDeleting(null)
    reload()
    showToast('Venue deleted')
  }

  return (
    <section aria-labelledby="venues-heading">
      <div className={styles.top}>
        <div>
          <h2 id="venues-heading" className={lists.heading}>
            My venues
            {venues.length > 0 && <span className={lists.count}>{venues.length}</span>}
          </h2>
          <p className={lists.subtitle}>Your venues and their upcoming bookings.</p>
        </div>
        {venues.length > 0 && (
          <button type="button" className={buttons.primary} onClick={openCreate}>
            <Plus size={18} aria-hidden="true" />
            Create venue
          </button>
        )}
      </div>

      {isLoading && <Loader label="Loading your venues…" />}
      {!isLoading && error && <ErrorMessage message={error} onRetry={reload} />}

      {!isLoading && !error && venues.length === 0 && (
        <div className={lists.empty}>
          <House size={32} aria-hidden="true" />
          <p className={lists.emptyTitle}>You have no venues yet</p>
          <p>List your first place and start getting bookings.</p>
          <button type="button" className={buttons.primary} onClick={openCreate}>
            <Plus size={18} aria-hidden="true" />
            Create your first venue
          </button>
        </div>
      )}

      {!isLoading && venues.length > 0 && (
        <ul className={lists.list}>
          {venues.map((venue) => (
            <li key={venue.id}>
              <MyVenueCard
                venue={venue}
                onEdit={() => setEditing(venue)}
                onDelete={() => setDeleting(venue)}
              />
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={isCreating || editing !== null}
        onClose={closeForm}
        title={editing ? 'Edit venue' : 'Create venue'}
        description="Fields marked * are required."
        size="wide"
      >
        <VenueForm venue={editing ?? undefined} onSaved={handleSaved} onCancel={closeForm} />
      </Modal>

      <Modal
        isOpen={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete venue?"
        size="small"
      >
        {deleting && (
          <DeleteVenue
            venue={deleting}
            onDeleted={handleDeleted}
            onCancel={() => setDeleting(null)}
          />
        )}
      </Modal>
    </section>
  )
}

export default MyVenues
