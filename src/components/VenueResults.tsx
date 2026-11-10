import { useEffect } from 'react'
import { Check } from 'lucide-react'
import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import NoResults from './NoResults'
import VenueCard from './VenueCard'
import { useVenues } from '../hooks/useVenues'
import { hasFilter, isAvailable, type StayFilter } from '../utils/availability'
import buttons from '../styles/buttons.module.css'
import styles from './VenueResults.module.css'

/** With a filter: load 100 venues per request and keep loading until this many are free */
const FILTER_PAGE_SIZE = 100
const MIN_AVAILABLE = 12

interface VenueResultsProps {
  query: string
  filter: StayFilter
}

/**
 * List of venues with "Show more": all venues, or search results when `query` is set.
 * When dates or guests are chosen, only the venues that are free for them are shown,
 * and more pages are loaded by themselves until enough free venues are found
 */
function VenueResults({ query, filter }: VenueResultsProps) {
  const isFiltered = hasFilter(filter)
  const { venues, total, isLastPage, isLoading, error, loadMore, retry } = useVenues(
    query,
    isFiltered ? FILTER_PAGE_SIZE : undefined
  )
  const shown = isFiltered ? venues.filter((venue) => isAvailable(venue, filter)) : venues

  // Not enough free venues yet: load the next page by itself
  const needsMore =
    isFiltered && shown.length < MIN_AVAILABLE && !isLastPage && !isLoading && !error
  useEffect(() => {
    if (needsMore) loadMore()
  }, [needsMore, loadMore])

  // Dates and guests go on to the venue page
  const stay = new URLSearchParams()
  if (filter.from && filter.to) {
    stay.set('from', filter.from)
    stay.set('to', filter.to)
  }
  if (filter.guests > 1) stay.set('guests', String(filter.guests))

  const hasVenues = venues.length > 0
  const isEmpty = !hasVenues && !isLoading && !error
  const isSearching = isFiltered && hasVenues && shown.length === 0 && (isLoading || needsMore)
  const noneAvailable = isFiltered && hasVenues && shown.length === 0 && isLastPage
  const totalText = total.toLocaleString('en-US')

  let heading = query ? `Results for “${query}”` : 'All venues'
  if (isFiltered) heading = query ? `Available for “${query}”` : 'Available venues'

  return (
    <section className={styles.results} aria-labelledby="results-heading">
      <h2 id="results-heading" className={styles.heading}>
        {heading}
        {!isFiltered && total > 0 && <span className={styles.count}>{totalText}</span>}
      </h2>

      {!hasVenues && isLoading && <Loader label="Loading venues…" />}
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

      {isSearching && (
        <Loader label={`Looking for free venues… checked ${venues.length} of ${totalText}`} />
      )}

      {noneAvailable && (
        <NoResults
          title="No free venues"
          message={`None of the ${totalText} venues fit your dates and guests. Try other dates or fewer guests.`}
        />
      )}

      {shown.length > 0 && (
        <>
          <ul className={styles.grid}>
            {shown.map((venue) => (
              <li key={venue.id}>
                <VenueCard venue={venue} search={stay.toString()} />
              </li>
            ))}
          </ul>

          <div className={styles.more}>
            <p className={styles.status} aria-live="polite">
              {isFiltered
                ? `Found ${shown.length} available · checked ${venues.length} of ${totalText} venues`
                : `Showing ${venues.length} of ${totalText} venues`}
            </p>

            {isLoading && <Loader label="Loading more venues…" />}

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

      {error && <ErrorMessage message={error} onRetry={retry} />}
    </section>
  )
}

export default VenueResults
