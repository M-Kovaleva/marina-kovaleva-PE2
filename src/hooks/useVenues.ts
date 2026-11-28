import { useEffect, useState } from 'react'
import { useNavigationType } from 'react-router-dom'
import { getVenues, searchVenues } from '../services/venues'
import type { Venue } from '../types/venue'
import { getErrorMessage } from '../utils/errors'

const PAGE_SIZE = 24

interface VenuesState {
  venues: Venue[]
  total: number
  isLastPage: boolean
  loadedPage: number
  error: string | null
}

const initialState: VenuesState = {
  venues: [],
  total: 0,
  isLastPage: false,
  loadedPage: 0,
  error: null,
}

/**
 * The last list, kept in memory: "Back" (our link or the browser) shows the same list
 * with all its "Show more" pages. A page reload clears it
 */
let savedList: { key: string; state: VenuesState } | null = null

/** The venue last opened from the list: after "Back" the list scrolls to its card */
let openedVenueId: string | null = null

export function rememberOpenedVenue(id: string) {
  openedVenueId = id
}

/**
 * `pageSize` is how many venues one page has (the API allows up to 100)
 * Give the component that uses it a `key` with the query and page size,
 * so a new search starts from page 1
 */
export function useVenues(query = '', pageSize = PAGE_SIZE) {
  const key = `${query}|${pageSize}`
  // "POP" = a step back or forward in the history, not a new search
  const isBack = useNavigationType() === 'POP'
  // Only on the first render: coming back to the same search, start from the saved list
  const [saved] = useState(() => (isBack && savedList?.key === key ? savedList.state : null))
  const [returnTo] = useState(() => (saved ? openedVenueId : null))

  const [page, setPage] = useState(saved?.loadedPage ?? 1)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<VenuesState>(saved ?? initialState)
  const { loadedPage } = state

  // Keep the list for the next "Back"
  useEffect(() => {
    if (state.loadedPage > 0) savedList = { key, state }
  }, [key, state])

  useEffect(() => {
    // This page is already here (the saved list)
    if (loadedPage >= page) return
    const controller = new AbortController()

    const request = query
      ? searchVenues(query, page, pageSize, controller.signal)
      : getVenues(page, pageSize, controller.signal)
    request
      .then((res) => {
        setState((prev) => {
          const known = new Set(prev.venues.map((venue) => venue.id))
          const newVenues = res.data.filter((venue) => !known.has(venue.id))
          return {
            venues: page === 1 ? res.data : [...prev.venues, ...newVenues],
            total: res.meta.totalCount,
            isLastPage: res.meta.isLastPage,
            loadedPage: page,
            error: null,
          }
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = getErrorMessage(error)
        setState((prev) => ({ ...prev, error: message }))
      })

    return () => controller.abort()
  }, [query, pageSize, page, attempt, loadedPage])

  const isLoading = state.loadedPage < page && state.error === null

  function loadMore() {
    if (!isLoading && !state.isLastPage) setPage((p) => p + 1)
  }

  function retry() {
    setState((prev) => ({ ...prev, error: null }))
    setAttempt((a) => a + 1)
  }

  return {
    venues: state.venues,
    total: state.total,
    isLastPage: state.isLastPage,
    isLoading,
    error: state.error,
    loadMore,
    retry,
    returnTo,
  }
}
