import { Check } from 'lucide-react'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import VenueCard from './VenueCard'
import { useVenues } from '../hooks/useVenues'
import { isAvailable, type StayFilter } from '../utils/availability'
import buttons from '../styles/buttons.module.css'
import styles from './VenueResults.module.css'
import NoResults from './NoResults'

interface VenueResultsProps {
  query: string
  filter: StayFilter
}

/**
 * List of venues with "Show more": all venues, or search results when `query` is set.
 * When dates or guests are chosen, only the venues that are free for them are shown
 */
function VenueResults({ query, filter }: VenueResultsProps) {
  const { venues, total, isLastPage, isLoading, error, loadMore, retry } = useVenues(query)
  const hasDates = Boolean(filter.from && filter.to)
  const isFiltered = hasDates || filter.guests > 1
  const shown = isFiltered ? venues.filter((venue) => isAvailable(venue, filter)) : venues

  // Dates and guests go on to the venue page
  const stay = new URLSearchParams()
  if (hasDates) {
    stay.set('from', filter.from)
    stay.set('to', filter.to)
  }
  if (filter.guests > 1) stay.set('guests', String(filter.guests))

  const hasVenues = venues.length > 0
  const isEmpty = !hasVenues && !isLoading && !error

  return (
    <section className={styles.results} aria-labelledby="results-heading">
      <h2 id="results-heading" className={styles.heading}>
        {query ? `Results for “${query}”` : 'All venues'}
        {!isFiltered && total > 0 && (
          <span className={styles.count}>{total.toLocaleString('en-US')}</span>
        )}
      </h2>

      {!hasVenues && isLoading && <Loader label="Loading venues…" />}
      {!hasVenues && error && <ErrorMessage message={error} onRetry={retry} />}
      {isEmpty && (
        <NoResults
          title="No venues found"
          message={
            query
              ? `We couldn’t find any venues for “${query}”. Try another place or word.`
              : 'There are no venues to show right now.'
          }
        />
      )}

      {hasVenues && (
        <>
          {shown.length > 0 ? (
            <ul className={styles.grid}>
              {shown.map((venue) => (
                <li key={venue.id}>
                  <VenueCard venue={venue} search={stay.toString()} />
                </li>
              ))}
            </ul>
          ) : (
            <NoResults
              title="No free venues yet"
              message="None of the venues loaded so far are free for your dates and guests. Try other dates, fewer guests or load more venues."
            />
          )}

          <div className={styles.more}>
            <p className={styles.status} aria-live="polite">
              {isFiltered
                ? `Showing ${shown.length} available of ${venues.length} loaded venues`
                : `Showing ${venues.length} of ${total.toLocaleString('en-US')} venues`}
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
