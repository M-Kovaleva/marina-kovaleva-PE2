import { useEffect, useState } from 'react'
import { getVenue } from '../services/venues'
import type { Venue } from '../types/venue'
import { ApiError } from '../services/apiFetch'

interface VenueState {
  venue: Venue | null
  error: string | null
  /** The API says there is no venue with this ID (404) or the ID is not valid (400) */
  notFound: boolean
  /** Which request this result belongs to ("id-attempt") */
  requestKey: string
}

/**
 * Loads one venue by ID (with its owner and bookings).
 * `retry` repeats a failed request
 */
export function useVenue(id: string) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<VenueState>({
    venue: null,
    error: null,
    notFound: false,
    requestKey: '',
  })
  const requestKey = `${id}-${attempt}`

  useEffect(() => {
    const controller = new AbortController()

    getVenue(id, controller.signal)
      .then((venue) => setState({ venue, error: null, notFound: false, requestKey }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Something went wrong.'
        const notFound = error instanceof ApiError && (error.status === 404 || error.status === 400)
        setState({ venue: null, error: message, notFound, requestKey })
      })

    return () => controller.abort()
  }, [id, requestKey])

  // Still loading while the saved result belongs to an older request
  const isLoading = state.requestKey !== requestKey

  function retry() {
    setAttempt((a) => a + 1)
  }

  return { venue: state.venue, isLoading, error: state.error, notFound: state.notFound, retry }
}
