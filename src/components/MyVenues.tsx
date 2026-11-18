import { House } from 'lucide-react'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import MyVenueCard from './MyVenueCard'
import { useMyVenues } from '../hooks/useMyVenues'
import lists from '../styles/profileList.module.css'

interface MyVenuesProps {
  name: string
  token: string
}

/** "My venues": the venues of a venue manager, each with its upcoming bookings */
function MyVenues({ name, token }: MyVenuesProps) {
  const { venues, isLoading, error, reload } = useMyVenues(name, token)

  return (
    <section aria-labelledby="venues-heading">
      <h2 id="venues-heading" className={lists.heading}>
        My venues
        {venues.length > 0 && <span className={lists.count}>{venues.length}</span>}
      </h2>
      <p className={lists.subtitle}>Your venues and their upcoming bookings.</p>

      {isLoading && <Loader label="Loading your venues…" />}
      {!isLoading && error && <ErrorMessage message={error} onRetry={reload} />}

      {!isLoading && !error && venues.length === 0 && (
        <div className={lists.empty}>
          <House size={32} aria-hidden="true" />
          <p className={lists.emptyTitle}>You have no venues yet</p>
          <p>List your first place and start getting bookings.</p>
        </div>
      )}

      {!isLoading && venues.length > 0 && (
        <ul className={lists.list}>
          {venues.map((venue) => (
            <li key={venue.id}>
              <MyVenueCard venue={venue} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MyVenues
