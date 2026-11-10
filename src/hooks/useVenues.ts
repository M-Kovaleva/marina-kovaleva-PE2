import { useEffect, useState } from 'react'
import { getVenues, searchVenues } from '../services/venues'
import type { Venue } from '../types/venue'

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
 * `pageSize` is how many venues one page has (the API allows up to 100)
 * Give the component that uses it a `key` with the query and page size,
 * so a new search starts from page 1
 */
export function useVenues(query = '', pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<VenuesState>(initialState)

  useEffect(() => {
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
        const message = error instanceof Error ? error.message : 'Something went wrong.'
        setState((prev) => ({ ...prev, error: message }))
      })

    return () => controller.abort()
  }, [query, pageSize, page, attempt])

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
  }
}
