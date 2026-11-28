import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Check, X } from 'lucide-react'
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
  const { venues, total, isLastPage, isLoading, error, loadMore, retry, returnTo } = useVenues(
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

  // Back from a venue page: show its card and put the focus on its link
  useEffect(() => {
    if (!returnTo) return
    const item = document.getElementById(`venue-${returnTo}`)
    item?.scrollIntoView({ block: 'center' })
    item?.querySelector('a')?.focus({ preventScroll: true })
  }, [returnTo])

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

  // "None of the 1 venues" is wrong English, so one venue gets its own text
  const noneFit =
    total === 1
      ? 'The only venue we found doesn’t fit'
      : `None of the ${totalText} venues we found fit`

  // Long list: take the user back to the search form to change the search
  function backToSearch() {
    const form = document.getElementById('search')
    if (!form) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    form.focus({ preventScroll: true })
  }

  let heading = query ? `Results for “${query}”` : 'All venues'
  if (isFiltered) heading = query ? `Available for “${query}”` : 'Available venues'

  return (
    <section className={styles.results} aria-labelledby="results-heading">
      <div className={styles.top}>
        <h2 id="results-heading" className={styles.heading}>
          {heading}
          {!isFiltered && total > 0 && <span className={styles.count}>{totalText}</span>}
        </h2>
        {/* Only while a search is set. "/" has no search in the address, so the form resets too */}
        {(query || isFiltered) && (
          <Link to="/" className={styles.clear}>
            <X size={16} aria-hidden="true" />
            Clear search
          </Link>
        )}
      </div>

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
          message={`${noneFit} your dates and guests. Try other dates or fewer guests.`}
        />
      )}

      {shown.length > 0 && (
        <>
          <ul className={styles.grid}>
            {shown.map((venue) => (
              <li key={venue.id} id={`venue-${venue.id}`}>
                <VenueCard venue={venue} search={stay.toString()} />
              </li>
            ))}
          </ul>

          <div className={styles.more}>
            <p className={styles.status} aria-live="polite">
              {isFiltered
                ? `Found ${shown.length} available - checked ${venues.length} of ${totalText} venues`
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

            <button type="button" className={styles.back} onClick={backToSearch}>
              <ArrowUp size={16} aria-hidden="true" />
              Back to search
            </button>
          </div>
        </>
      )}

      {error && <ErrorMessage message={error} onRetry={retry} />}
    </section>
  )
}

export default VenueResults
