import { Check } from 'lucide-react'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import VenueCard from '../components/VenueCard'
import { useVenues } from '../hooks/useVenues'
import buttons from '../styles/buttons.module.css'
import styles from './HomePage.module.css'

function HomePage() {
  const { venues, total, isLastPage, isLoading, error, loadMore, retry } = useVenues()
  const hasVenues = venues.length > 0

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Find your next stay.</h1>

      <section className={styles.venues} aria-labelledby="venues-heading">
        <h2 id="venues-heading" className={styles.heading}>
          All venues
          {total > 0 && <span className={styles.count}>{total.toLocaleString('en-US')}</span>}
        </h2>

        {!hasVenues && isLoading && <Loader label="Loading venues…" />}
        {!hasVenues && error && <ErrorMessage message={error} onRetry={retry} />}

        {hasVenues && (
          <>
            <ul className={styles.grid}>
              {venues.map((venue) => (
                <li key={venue.id}>
                  <VenueCard venue={venue} />
                </li>
              ))}
            </ul>

            <div className={styles.more}>
              <p className={styles.status} aria-live="polite">
                Showing {venues.length} of {total.toLocaleString('en-US')} venues
              </p>

              {isLoading && <Loader label="Loading more venues…" />}
              {error && <ErrorMessage message={error} onRetry={retry} />}

              {!isLoading && !error && !isLastPage && (
                <button type="button" className={buttons.secondary} onClick={loadMore}>
                  Show more venues
                </button>
              )}

              {isLastPage && (
                <p className={styles.end}>
                  <Check size={20} aria-hidden="true" />
                  You’ve seen all venues
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default HomePage
