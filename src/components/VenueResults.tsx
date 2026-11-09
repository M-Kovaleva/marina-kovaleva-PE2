import { Check } from 'lucide-react'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import VenueCard from './VenueCard'
import { useVenues } from '../hooks/useVenues'
import buttons from '../styles/buttons.module.css'
import styles from './VenueResults.module.css'

interface VenueResultsProps {
  query: string
}

/**
 * List of venues with "Show more": all venues, or search results when `query` is set
 */
function VenueResults({ query }: VenueResultsProps) {
  const { venues, total, isLastPage, isLoading, error, loadMore, retry } = useVenues(query)
  const hasVenues = venues.length > 0
  const isEmpty = !hasVenues && !isLoading && !error

  return (
    <section className={styles.results} aria-labelledby="results-heading">
      <h2 id="results-heading" className={styles.heading}>
        {query ? `Results for “${query}”` : 'All venues'}
        {total > 0 && <span className={styles.count}>{total.toLocaleString('en-US')}</span>}
      </h2>

      {!hasVenues && isLoading && <Loader label="Loading venues…" />}
      {!hasVenues && error && <ErrorMessage message={error} onRetry={retry} />}
      {isEmpty && <p className={styles.status}>No venues found.</p>}

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
  )
}

export default VenueResults
