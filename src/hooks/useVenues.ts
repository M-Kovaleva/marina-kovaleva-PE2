import { useEffect, useState } from 'react'
import { getVenues } from '../services/venues'
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
 * Loads venues page by page (newest first)
 * `loadMore` adds the next page to the list, `retry` repeats a failed request
 */
export function useVenues() {
  const [page, setPage] = useState(1)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<VenuesState>(initialState)

  useEffect(() => {
    const controller = new AbortController()

    getVenues(page, PAGE_SIZE, controller.signal)
      .then((res) => {
        setState((prev) => ({
          venues: page === 1 ? res.data : [...prev.venues, ...res.data],
          total: res.meta.totalCount,
          isLastPage: res.meta.isLastPage,
          loadedPage: page,
          error: null,
        }))
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Something went wrong.'
        setState((prev) => ({ ...prev, error: message }))
      })

    return () => controller.abort()
  }, [page, attempt])

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
